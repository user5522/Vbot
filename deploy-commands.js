require("dotenv").config();
const { SlashCommandBuilder, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID
    ),
    { body: commands }
  )
  .then(() => console.log("successfully registered application commands."))
  .catch(console.error);
