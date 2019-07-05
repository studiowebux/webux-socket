// helper
const timeout = ms => new Promise(res => setTimeout(res, ms));

// action
const createUser = body => {
  return new Promise(async (resolve, reject) => {
    if (!body) {
      return reject(new Error("Body is not present !"));
    }
    console.log("Start the creation of the entry");
    console.log("then wait 2 seconds");
    await timeout(2000);
    return resolve({ msg: "Success !" });
  });
};

// route
const route = async (req, res, next) => {
  try {
    const obj = await createUser(req.body);
    if (!obj) {
      return next(new Error("User not create."));
    }
    return res.status(201).json(obj);
  } catch (e) {
    next(e);
  }
};

// socket with auth

const socket = client => {
  return async body => {
    console.log("called !")
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
