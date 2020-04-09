const options = require("./config");

const webuxSocket = require("../../index"); // @studiowebux/socket

const express = require("express");
const app = express();
const server = require("http").createServer(app);

const jwt = require("jsonwebtoken");

const cluster = require("cluster");
const numCPUs = 2; //require("os").cpus().length;

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

  if (cluster.isMaster) {
    console.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.info(`Worker ${worker.process.pid} died`);
    });
  } else {
    server.listen(1339, () => {
      console.log("Server is listening on port 1339");
    });
  }
}

try {
  LoadApp();
} catch (e) {
  console.error(e);
  process.exit(2);
}
