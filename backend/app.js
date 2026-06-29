const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');

const dotenv = require('dotenv');
const { url } = require('inspector');
const { error } = require('console');
dotenv.config();

const app = express();
app.use(express.json())
app.use(cors({ origin: '*' }));



app.use("/", express.static(process.env.FRONTEND));


const routesDir = path.join(__dirname, 'routes');
const apiRoute = "api/"



function inspectDirectoryForRoutes(routesDir, urlRoute = "") {

  fs.readdirSync(routesDir).forEach(file => {

    const isDirectory = fs.lstatSync(routesDir + "/" + file).isDirectory()
    if (!isDirectory) {
      if (!file.endsWith('.js')) return;

      const routePath = file === '_head.js'
        ? `/${urlRoute}`
        : `/${urlRoute}${path.basename(file, '.js')}`;

      var router = require(path.join(routesDir, file));
      if (router.router != undefined) router = router.router

      app.use(routePath, router);


    } else {
      inspectDirectoryForRoutes(routesDir + "/" + file, urlRoute + file + "/")
    }



  });
}
inspectDirectoryForRoutes(routesDir, urlRoute = apiRoute)

app.get('/{*a}', async function (req, res) {
  let html = fs.readFileSync(path.join(process.env.FRONTEND, "index.html"), 'utf8');

  const url = req.originalUrl
  const isArchive = url.split("/")
  if (isArchive.length > 2 && isArchive[1] == "archive") {



    var challengeInfo = await db("challenges").where("id", isArchive[2])
    if (challengeInfo.length > 0) {
      challengeInfo = challengeInfo[0]



      html = html.replace(/^.*<meta name="og.*$/gm, '');
      html = html.replace(/^.*<meta property="og.*$/gm, '');


      html = html.replace("<embed-meta-tags-98734/>", `
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="og:title" content="AOMCGuessr Archive" />
          <meta name="og:description"
          content='"${challengeInfo.title}" by ${challengeInfo.contributor}' />
          <meta property="og:image" content="https://guessr.warmsandybeaches.net/api/images/${isArchive[2]}" />
          `)
    }

  }



  res.send(html);
});




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.IMAGES); // Files will be stored in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});


const db = require("./db/db.js")
const jwt = require('jsonwebtoken');


function transcodeImage(input, output, maxWidth = 3840) {
  return new Promise((resolve, reject) => {
    const vf = `scale=if(gt(iw\\,${maxWidth})\\,${maxWidth}\\,iw):-2`;

    ffmpeg(input)
      .output(output)
      .outputOptions([
        '-lossless 0',    // lossy
        '-q:v 95',
        '-compression_level 6',
      ])
      .videoFilters(vf)

      .on('end', () => {
        console.log(`${path.parse(input).name} has been transcoded to webp`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`Error transcoding file: ${err.message}`);
        reject(err);
      })
      .run();
  });
}


const upload = multer({ storage: storage });
app.post("/" + apiRoute + 'upload', upload.single('file'), (req, res) => {

  const submissionParams = req.body


  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];



  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      res.status(401).send({ resetToken: 1, error: 1, message: 'Invalid or expired token' })
      fs.unlinkSync(path.join(`${process.env.IMAGES}/`, req.file.filename));
      return 0;
    }

    const user = decoded.username
    const userData = (await db("users").select("*").where("username", user))
    if (userData.length < 0) return;
    const userContributer = userData[0].contributor

    if (!userContributer) {
      res.status(403).send({ error: 1, message: 'not authorised contributer, this has been reported to the admin' })
      fs.unlinkSync(path.join(`${process.env.IMAGES}/`, req.file.filename));
      return 0;
    } else {



      if (submissionParams.title == "") {
        res.status(400).json({
          error: true,
          message: "empty title"
        }); return;
      }
      const otherChallengesWithTitle = await db("challenges").select("*").where("title", submissionParams.title)

      if (otherChallengesWithTitle.length > 0) {
        res.status(400).json({
          error: true,
          message: "submission with that title already exists"
        }); return;
      }


      if (submissionParams.x == undefined || submissionParams.y == undefined || parseFloat(submissionParams.x) == NaN || parseFloat(submissionParams.y) == NaN) {
        res.status(400).json({
          error: true,
          message: "invalid answer coordinates"
        }); return;
      }



      if (!req.file) {
        return res.status(400).send('No file uploaded!');
      }


      const newChallenge = {
        imagePath: `images/${req.file.filename}`,
        answer: JSON.stringify({
          x: parseFloat(submissionParams.x),
          y: parseFloat(submissionParams.y)
        }),
        title: submissionParams.title,
        contributor: user,
      }

      console.log(`${newChallenge.contributor} uploaded ${newChallenge.title}`)

      try {
        const imageFilePath = path.parse(req.file.filename)
        if (imageFilePath.ext!=".webp") await transcodeImage(process.env.IMAGES + "/" + imageFilePath.base, process.env.IMAGES + "/" + imageFilePath.name + ".webp");
        await db("challenges").insert(newChallenge)

        res.status(200).json({ message: `File uploaded and transcoded successfully!` });
      } catch (transcodeError) {
        res.status(500).send({ message: transcodeError.message, error: true });
      }


    }




  })



});
/*
setTimeout(async function () {
  const folderPath = "/media/pi/0CE6-D271/images"
  const images = fs.readdirSync(folderPath).map(fileName => {
    return path.join(folderPath, fileName);
  })

  const webps = new Set()
  const others = new Set()


  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const imgP = path.parse(image)
    if (imgP.ext == ".webp") {
      webps.add(imgP.name)
    } else if (imgP.ext == ".png") {
      others.add(imgP)
    }
  }
  console.log(`webps: ${webps.size}, pngs: ${others.size}`)
  var count = -1,
    skip = true
  for (const image of others) {
    count += 1
    if (skip) {
      if (image.name=="1781524730262-497206827") {

        skip = false
        continue
      } else {
        continue
      }
      
    }

    console.log("prcessing ", image.name, `${count}/${others.size}`)
    await transcodeImage(folderPath + "/" + image.base, folderPath + "/" + image.name + ".webp")
    
    
  }



}, 1);
*/


const rotationInterval = (1000 * 60) * 10

const { scheduleEvery, selectChallenge, rotateChallenge } = require("./scheduler.js")
scheduleEvery(rotationInterval, async function () { await rotateChallenge() })
setTimeout(async function () {
  await rotateChallenge()
  
}, 1);

const { updateScores } = require('./scores');
updateScores()

const port = 3000;
app.listen(port, () => {
  
});
