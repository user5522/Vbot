const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
} = require("discord.js");
const emojis = require("../lib/emojis");

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
        const emojiInfo = getEmojis(guild);

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
              name: "Creation date",
              value: `<t:${guildCreationDate}> \*\*| \*\* <t:${guildCreationDate}:R>`,
              inline: false,
            },
            {
              name: `Channels - ${channelCount.total}`,
              value: `${emojis.CATEGORY} Categories: ${
                channelCount.category
              } \n${emojis.TEXT_CHANNEL} Text: ${channelCount.text} \n${
                emojis.VOICE_CHANNEL
              } Voice: ${channelCount.voice} \n${
                isCommunity
                  ? `${
                      channelCount.announcement > 0
                        ? `\n ${emojis.ANNOUNCEMENT_CHANNEL} Announcement: ${channelCount.announcement}`
                        : ``
                    }${
                      channelCount.stage > 0
                        ? `\n ${emojis.STAGE_CHANNEL} Stage: ${channelCount.stage}`
                        : ``
                    }${
                      channelCount.forum > 0
                        ? `\n ${emojis.FORUM_CHANNEL}Forum: ${channelCount.forum}`
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
              name: `Emojis - ${emojiInfo.total}`,
              value: `
              Static: ${emojiInfo.static} \nAnimated: ${emojiInfo.animated}
              \n${emojiInfo.preview}
              `,
              inline: true,
            },
            {
              name: `Members - ${memberCount.total}`,
              value: `
              ${emojis.MEMBERS} Members: ${memberCount.members} \n${emojis.BOTS} Bots: ${memberCount.bots}
              `,
              inline: true,
            },
            {
              name: `Roles - ${roleCount}`,
              value: `${getRoleList(guild)}`,
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
        await interaction.reply({
          embeds: [embed],
        });
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

        await interaction.reply({
          embeds: [embed],
        });
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

function getEmojis(guild) {
  let counter = 0;
  let preview = "";

  guild.emojis.cache.forEach((e) => {
    preview += e.toString();
    counter++;
    if (counter % 5 === 0) {
      preview += "\n";
    } else {
      preview += " ";
    }
  });

  return {
    total: guild.emojis.cache.size,
    static: guild.emojis.cache.filter((e) => !e.animated).size,
    animated: guild.emojis.cache.filter((e) => e.animated).size,
    preview: preview,
  };
}

function getMemberCount(guild) {
  return {
    total: guild.memberCount,
    members:
      guild.memberCount - guild.members.cache.filter((m) => m.user.bot).size,
    bots: guild.members.cache.filter((m) => m.user.bot).size,
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
    .map((r) => r)
    .join(" ");
}
