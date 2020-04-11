const socket = (client, io) => {
  return () => {
    console.debug(`webux-socket - Socket ${client.id} disconnected.`);
  };
};

module.exports = { socket };
