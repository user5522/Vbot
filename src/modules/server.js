const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
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
          .setColor("#000000")
          .setAuthor({
            name: `${guildName} - Server Info`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .addFields(
            { name: "ID", value: `${guildID}`, inline: true },
            { name: "Owner", value: `${guildOwner}`, inline: true },
            {
              name: "Creation Date",
              value: `<t:${guildCreationDate}> \*\*| \*\* <t:${guildCreationDate}:R>`,
              inline: false,
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
              Categories: ${channelCount.category}
              Text: ${channelCount.text}
              Voice: ${channelCount.voice}${
                isCommunity
                  ? `${
                      channelCount.announcement > 0
                        ? `\nAnnouncement: ${channelCount.announcement}`
                        : ``
                    }${
                      channelCount.stage > 0
                        ? `\nStage: ${channelCount.stage}`
                        : ``
                    }${
                      channelCount.forum > 0
                        ? `\nForum: ${channelCount.forum}`
                        : ``
                    }${
                      channelCount.directory > 0
                        ? `\nDirectory: ${channelCount.directory}`
                        : ``
                    }`
                  : ``
              }`,
              inline: true,
            },
            {
              name: `Roles - ${roleCount}`,
              value: `${getRoleList(guild).join(", ")}`,
              inline: false,
            }
          );
        if (guild.premiumSubscriptionCount > 0) {
          embed.addFields(
            {
              name: `Total Boosts`,
              value: `${guild.premiumSubscriptionCount}`,
              inline: true,
            },
            {
              name: `Boost Tier`,
              value: `${guild.premiumTier}/3`,
              inline: true,
            }
          );
        }
        await interaction.reply({ embeds: [embed] });
        break;
      }
      case "icon": {
        let embed;
        embed = new EmbedBuilder()
          .setColor("#000000")
          .setAuthor({
            name: `${guildName} - Server Icon`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            `\*\*Download: [[x2048](${guild.iconURL({
              size: 2048,
              format: "png",
              dynamic: true,
            })}) | [x4096](${guild.iconURL({
              size: 4096,
              format: "png",
              dynamic: true,
            })})]\*\*`
          )
          .setImage(
            guild.iconURL({ size: 2048, format: "png", dynamic: true })
          );

        await interaction.reply({ embeds: [embed] });
        break;
      }
      default: {
        await interaction.reply(
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

function isCommunity(guild) {
  return guild.features?.includes("COMMUNITY");
}

function getChannelCount(guild) {
  return {
    total: guild.channels.cache.filter(
      (c) =>
        c.type === ChannelType.GuildText ||
        c.type === ChannelType.GuildVoice ||
        c.type === ChannelType.GuildStageVoice ||
        c.type === ChannelType.GuildAnnouncement ||
        c.type === ChannelType.GuildDirectory ||
        c.type === ChannelType.GuildForum
    ).size,
    text: guild.channels.cache.filter((c) => c.type === ChannelType.GuildText)
      .size,
    voice: guild.channels.cache.filter((c) => c.type === ChannelType.GuildVoice)
      .size,
    stage: guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildStageVoice
    ).size,
    announcement: guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildAnnouncement
    ).size,
    category: guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildCategory
    ).size,
    forum: guild.channels.cache.filter((c) => c.type === ChannelType.GuildForum)
      .size,
    directory: guild.channels.cache.filter(
      (c) => c.type === ChannelType.GuildDirectory
    ).size,
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
