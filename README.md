# Webux Socket

This module is a wrapper for socket.io
it allows to build automatically the socket resource based on a given directory.

## Installation

```bash
npm i --save webux-socket
```

## Usage

How it works,  
when you expose action.socket, the parser get that function and append it to a listener named by {filename + action}.  

### The isAuthenticated function

this function should be define as follow:
function isAuthenticated(token, next){
// check token validity
// valid
next(null, user);
// not valid
next(err);
}

### Example
for more examples check the examples directory.

actions/user/create.js

```
// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const createUser = body => {
  return new Promise(async (resolve, reject) => {
    if (!body) {
      return reject(new Error("Body is not present !"));
    }
    await timeout(500);
    return resolve({ msg: "Success !" });
  });
};

// route
const route = async (req, res, next) => {
// ...
};

// socket with auth
const socket = client => {
  return async body => {
    try {
      if (!client.auth) {
        client.emit("unauthorized", { message: "Unauthorized" });
        return;
      }
      const obj = await createUser(body).catch(e => {
        client.emit("error", e);
      });
      if (!obj) {
        client.emit("error", "User not create");
      }

      client.emit("userCreated", obj);
    } catch (e) {
      client.emit("error", e);
    }
  };
};

module.exports = {
  createUser,
  socket,
  route
};

```

test.js

```
const path = __dirname+ "/actions";
// Authentication is disabled
const socket = require("../index")(path);

const express = require('express');
const app = express();
const server = require('http').createServer(app)

socket.listen(server);
server.listen(1337);
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

SEE LICENSE IN license.txt
