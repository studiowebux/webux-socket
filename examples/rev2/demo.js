const options = require("./config");
const webuxSocket = require("../../index"); // @studiowebux/socket
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const jwt = require('jsonwebtoken')

// to give a jwt token for testing,

app.use('/giveme', (req, res, next)=>{
  const token = jwt.sign({aString:"SHuuut ! this is my payload"}, "HARDCODED_JWT_SECRET");

  res.status(200).json({
    'accessToken': token
  })
})

async function LoadApp() {
  // loading the webux socket module
  await webuxSocket(options, server, console);

  console.log("Socket loaded !");

  server.listen(1339, () => {
    console.log("Server is listening on port 1339");
  });
}

try{
  LoadApp()
} catch(e){
  console.error(e)
  process.exit(2);
}