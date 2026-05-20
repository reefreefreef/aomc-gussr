const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const multer = require('multer');

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

      const router = require(path.join(routesDir, file));

      app.use(routePath, router);


    } else {
      inspectDirectoryForRoutes(routesDir + "/" + file, urlRoute + file + "/")
    }



  });
}
inspectDirectoryForRoutes(routesDir, urlRoute = apiRoute)

app.get('/archive', async function (req, res) {
  res.sendFile("index.html", { root: process.env.FRONTEND }); //placeholder
});
app.get('/admin', async function (req, res) {
  //console.log(await getLeastGuessed(5))
  res.sendFile("index.html", { root: process.env.FRONTEND }); //placeholder
});
app.get('/contribute', async function (req, res) {
  res.sendFile("index.html", { root: process.env.FRONTEND }); //placeholder
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


const upload = multer({ storage: storage });
app.post("/" + apiRoute + 'upload', upload.single('file'), (req, res) => {

  const submissionParams = req.body


  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1];

  const secret = process.env.JWT_SECRET;

  jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      res.status(401).send({ resetToken: 1, error: 1, message: 'Invalid or expired token' })
      fs.unlinkSync(path.join('images/', req.file.filename));
      return 0;
    }

    const user = decoded.username
    const userData = (await db("users").select("*").where("username", user))
    if (userData.length < 0) return;
    const userContributer = userData[0].contributor

    if (!userContributer) {
      res.status(403).send({ error: 1, message: 'not authorised contributer, this has been reported to the admin' })
      fs.unlinkSync(path.join('images/', req.file.filename));
      return 0;
    } else {

      
      
      if (submissionParams.title == "") {
        res.status(400).json({
          error: true,
          message: "empty title"
        }); return;
      }
      const otherChallengesWithTitle = await db("challenges").select("*").where("title", submissionParams.title)

      if (otherChallengesWithTitle.length>0) {
        res.status(400).json({
          error: true,
          message: "submission with that title already exists"
        }); return;
      }


      if (submissionParams.x==undefined || submissionParams.y == undefined || parseFloat(submissionParams.x) == NaN || parseFloat(submissionParams.y) == NaN) {
        res.status(400).json({
          error: true,
          message: "invalid answer coordinates"
        }); return;
      }



      if (!req.file) {
        return res.status(400).send('No file uploaded!');
      }


      const newChallenge = {
        imagePath:`images/${req.file.filename}`,
        answer:JSON.stringify({
          x:parseFloat(submissionParams.x),
          y:parseFloat(submissionParams.y)
        }),
        title:submissionParams.title,
        contributor:user,
      }

      await db("challenges").insert(newChallenge)


      res.json({message:`File uploaded successfully! Filename: ${req.file.filename}`});
    }




  })



});


const rotationInterval = (1000*60) * 20

const { getLeastGuessed, scheduleEvery } = require("./scheduler.js")
scheduleEvery(rotationInterval, async function(){
  const leastGuessed = await getLeastGuessed(20)
  const chosen = leastGuessed[Math.floor(Math.random()*leastGuessed.length)]

  await db("app_flags").where("key", "current_challenge").update("value", chosen.id)
  

})


const port = 3000;
app.listen(port, () => {

});