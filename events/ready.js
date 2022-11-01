module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`Ready on client ${client.user.tag}!`);
  },
};
