require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const client = new Client({ intents: GatewayIntentBits.Guilds });

client.commands = new Collection();
const commandsPath = path.join(__dirname, "src");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  console.log("Ready!");
});

client.on("interactionCreate", async (interaction) => {
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
});

client.login(process.env.TOKEN);
