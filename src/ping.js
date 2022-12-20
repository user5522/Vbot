const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription('returns "pong!"'),
  async execute(interaction) {
    try {
      const startTime = interaction.client.readyAt;
      const currentTime = new Date();
      const elapsedTime = (currentTime - startTime) / 1000;

      await interaction.channel.send(`
        > WebSocket ping: ${interaction.client.ws.ping}ms
        > Up time: ${elapsedTime}s
      `);
    } catch (error) {
      await interaction.channel.send(
        "An error occurred while executing the command."
      );
      console.error(error);
    }
  },
};
