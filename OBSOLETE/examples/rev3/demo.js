// Please run this command before,
// docker run --name redis -p 6379:6379 redis

const options = require("./config");
const webuxSocket = require("../../src/index"); // @studiowebux/socket
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.use(cors());

// to give a jwt token for testing,

app.use("/giveme", (req, res, next) => {
  const token = jwt.sign(
    { aString: "SHuuut ! this is my payload" },
    "HARDCODED_JWT_SECRET"
  );

  res.status(200).json({
    accessToken: token
  });
});

async function LoadApp() {
  // loading the webux socket module
  await webuxSocket(options, server, console);

  console.log("Socket loaded !");

  server.listen(1339, () => {
    console.log("Server is listening on port 1339");
  });
}

try {
  LoadApp();
} catch (e) {
  console.error(e);
  process.exit(2);
}
