const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  Message,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("server")
    .setDescription("Returns information about the current server")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("returns information about the current server")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("icon")
        .setDescription("returns the current server's icon")
    ),
  async execute(interaction) {
    const guild = interaction.guild;
    const guildName = guild.name;
    const guildID = guild.id;
    const guildCreationDate = Math.floor(guild.createdTimestamp / 1000);
    const guildOwner = await guild.fetchOwner();

    switch (interaction.options.getSubcommand()) {
      case "info": {
        const memberCount = getMemberCount(guild);
        const channelCount = getChannelCount(guild);
        const roleCount = getRoleCount(guild);

        const embed = new EmbedBuilder()
          .setTitle(`${guildName} - Server Info`)
          .setColor("#000000")
          .setThumbnail(guild.iconURL({ dynamic: true }))
          .addFields(
            { name: "Server ID", value: `${guildID}`, inline: true },
            { name: "Owner", value: `${guildOwner}`, inline: true },
            {
              name: "Server Creation Date",
              value: `<t:${guildCreationDate}>`,
              inline: true,
            },
            {
              name: `Member Count - ${memberCount.total}`,
              value: `
              Members: ${memberCount.members}
              Bots: ${memberCount.bots}
              `,
              inline: true,
            },
            {
              name: `Channels - ${channelCount.total}`,
              value: `
              Text: ${channelCount.text}
              Voice: ${channelCount.voice}
              `,
              inline: true,
            },
            {
              name: `Roles - ${roleCount}`,
              value: `${getRoleList(guild).join(", ")}`,
              inline: true,
            },
            {
              name: `Total Server Boosts`,
              value: `${guild.premiumSubscriptionCount}`,
              inline: true,
            },
            {
              name: `Server Boost Tier`,
              value: `${guild.premiumTier}/3`,
              inline: true,
            }
          );
        await interaction.channel.send({ embeds: [embed] });
        break;
      }
      case "icon": {
        let embed;
        embed = new EmbedBuilder()
          .setTitle(`${guildName} - Server Icon`)
          .setColor("#000000")
          .setImage(guild.iconURL({ dynamic: true }));

        await interaction.channel.send({ embeds: [embed] });
        break;
      }
      default: {
        await interaction.channel.send(
          "Invalid subcommand. Use `/server info` or `/server icon`."
        );
      }
    }
  },
};

function getMemberCount(guild) {
  return {
    total: guild.memberCount,
    members: guild.members.cache.filter((member) => !member.user.bot).size,
    bots: guild.members.cache.filter((member) => member.user.bot).size,
  };
}

function getChannelCount(guild) {
  return {
    total: guild.channels.cache.filter(
      (c) =>
        c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
    ).size,
    text: guild.channels.cache.filter((c) => c.type === ChannelType.GuildText)
      .size,
    voice: guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice)
      .size,
  };
}

function getRoleCount(guild) {
  return guild.roles.cache.size;
}

function getRoleList(guild) {
  return guild.roles.cache
    .sort((a, b) => b.position - a.position)
    .map((r) => r);
}
