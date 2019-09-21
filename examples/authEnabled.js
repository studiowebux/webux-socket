const path = "./examples/actions"; // where the API actions are located.

function isAuthenticated(token, next) {
  if (!token) {
    return next("No token provided");
  }
  return next(null, { fullname: "test", email: "something@something.com" });
}

// loading socket
// the token is required and must be an object: { accessToken : "something" } 
// and the user has 3 seconds to call the authentication endpoint.
module.exports = require("../index")(path, isAuthenticated, "accessToken", 3000);
