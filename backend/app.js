const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const dotenv = require('dotenv');
const { url } = require('inspector');
dotenv.config();

const app = express();
app.use(express.json())
app.use(cors({ origin: 'http://localhost:5173' }));

app.use('/img', express.static('images'));






const routesDir = path.join(__dirname, 'routes');
const reverseProxy = "api/"


function inspectDirectoryForRoutes(routesDir, urlRoute="") {
  
  fs.readdirSync(routesDir).forEach(file => {

    const isDirectory = fs.lstatSync(routesDir + "/" + file).isDirectory()
    if (!isDirectory) {
      if (!file.endsWith('.js')) return;

      const routePath = file === '_head.js'
        ? `/${urlRoute}`
        : `/${urlRoute}${path.basename(file, '.js')}`;
    
      const router = require(path.join(routesDir, file));
      console.log(routePath)
      app.use(routePath, router);


    } else {
      inspectDirectoryForRoutes(routesDir+"/"+file, urlRoute+file+"/")
    }


    
  });
}
inspectDirectoryForRoutes(routesDir, urlRoute=reverseProxy)


const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});