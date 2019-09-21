const path = __dirname + "/actions"; // where the API actions are located.

// loading socket
// with auth enabled
const socket = require("./authEnabled");

/* frontend example */
// socket.on("connect", () => {
//   socket.emit("authentication", {
//     accessToken: "Bearer " + localStorage.access
//   });
//   socket.on("authenticated", () => {
//     socket.emit("getUsers");
//     socket.on("sendUsers", payload => {
//       console.log("receive");
//       console.log(payload);
//     });
//   });
//   socket.on("unauthorized", err => {
//     console.log("There was an error with the authentication:", err.message);
//   });
// });

const express = require("express");
const app = express();
const server = require("http").createServer(app);

socket.then(_socket => {
  _socket.listen(server, { path: "/socket.io" });
  server.listen(1338, () => {
    console.log("SERVER is listening on port 1338");
  });
});
