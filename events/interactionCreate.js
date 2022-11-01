module.exports = {
  name: "interactionCreate",
  once: false,
  execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.execute(interaction);
    } catch (err) {
      console.error(err);
      interaction.reply({
        content: "An error was found when executing this command!",
        ephemeral: true,
      });
    }
  },
};
