const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("returns information about the bot"),
  async execute(interaction) {
    try {
      const startTime = interaction.client.readyAt;
      const currentTime = new Date();
      const elapsedTime = (currentTime - startTime) / 1000;

      let seconds = Math.floor(elapsedTime % 60);
      let minutes = Math.floor((elapsedTime / 60) % 60);
      let hours = Math.floor((elapsedTime / 3600) % 24);
      let days = Math.floor(elapsedTime / 86400);

      let uptime = "";
      if (days > 0) {
        uptime += `${days}d `;
      }
      if (hours > 0) {
        uptime += `${hours}h `;
      }
      if (minutes > 0) {
        uptime += `${minutes}m `;
      }
      if (seconds > 0) {
        uptime += `${seconds}s`;
      }
      let ping = `${interaction.client.ws.ping}ms`;
      if (interaction.client.ws.ping > 100) {
        ping += " :warning:";
      }

      await interaction.reply(`
        > WebSocket ping: ${ping}
        > Up time: ${uptime}
        `);
    } catch (error) {
      await interaction.reply("An error occurred while executing the command.");
      console.error(error);
    }
  },
};
