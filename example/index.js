// Please run this command before,
// docker run --name redis -p 6379:6379 redis

const WebuxSocket = require("../src/index"); // @studiowebux/socket
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

app.use(cors());

const opts = {
  authentication: {
    accessTokenKey: "accessToken", // The cookie key name
    isAuthenticated: require(path.join(__dirname, ".", "isAuth.js")),
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: process.env.REDIS_PORT || "6379",
    password: process.env.REDIS_PASSWORD || "",
  },
  namespaces: {
    default: [path.join(__dirname, "actions", "user")],
    profile: [path.join(__dirname, "actions", "profile")],
    general: [],
  },
};

// to give a jwt token for testing,

app.use("/giveme", (req, res, next) => {
  const token = jwt.sign(
    { aString: "SHuuut ! this is my payload" },
    "HARDCODED_JWT_SECRET"
  );

  res.status(200).json({
    accessToken: token,
  });
});

function LoadApp() {
  // loading the webux socket module
  const webuxSocket = new WebuxSocket(opts, server);

  webuxSocket.AddAuthentication();
  webuxSocket.AddRedis(); // by default it uses 127.0.0.1 (when not configured)
  webuxSocket.Start();

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
