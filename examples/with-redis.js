const options = {
  redis: {
    host: "127.0.0.1",
    password: "password123",
    port: 6379,
    enabled: true,
    mock: false
  },
  path: "/socket.io"
};
const path = __dirname + "/actions"; // where the API actions are located.

// loading socket
// with auth enabled
// require("../index")(options, path, isAuthenticated, "accessToken", 3000);
// with auth disabled
const io = require("../index")(options, path);

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cluster = require("cluster");
const numCPUs = 2//require("os").cpus().length;

io.then(socket => {
  if(cluster.isMaster) {
    console.info(`Master ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      console.info(`Worker ${worker.process.pid} died`);
    });
  } else {
    socket.listen(server, options);
    server.listen(1338, () => {
      console.log("SERVER is listening on port 1338");
    });

  }
});
