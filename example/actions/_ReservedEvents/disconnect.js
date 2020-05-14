const socket = (client, io) => {
  return () => {
    console.debug(`!!! Socket ${client.id} disconnected.`);
  };
};

module.exports = { socket };
