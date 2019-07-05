const path = __dirname+ "/actions"; // where the API actions are located.

function isAuthenticated(token, next) {
  if (!token) {
    return next("No token provided");
  }
  return next(null, { fullname: "test", email: "something@something.com" });
}

// loading socket
// with auth enabled
// require("../index")(path, isAuthenticated, "accessToken", 3000);
// with auth disabled
const socket = require("../index")(path);

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

const express = require('express');
const app = express();
const server = require('http').createServer(app)

socket.listen(server);
server.listen(1337);