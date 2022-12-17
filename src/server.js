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
    if (interaction.options.getSubcommand() === "info") {
      const guild = interaction.guild;
      const guildName = guild.name;
      const guildID = guild.id;
      const guildCreationDate = Math.floor(guild.createdTimestamp / 1000);
      const guildOwner = await guild.fetchOwner();
      const totalMemberCount = await guild.memberCount;
      const memberCount = guild.members.cache.filter(
        (member) => !member.user.bot
      ).size;
      const botCount = guild.members.cache.filter(
        (member) => member.user.bot
      ).size;
      const textChannels = guild.channels.cache.filter(
        (c) => c.type === ChannelType.GuildText
      ).size;
      const voiceChannels = guild.channels.cache.filter(
        (c) => c.type === ChannelType.GuildVoice
      ).size;
      const allChannelCount = guild.channels.cache.filter(
        (c) =>
          c.type === ChannelType.GuildText || c.type === ChannelType.GuildVoice
      ).size;

      const guildRoleCount = guild.roles.cache.size;
      const totalGuildBoosts = guild.premiumSubscriptionCount;
      const guildBoostTier = guild.premiumTier;
      const guildIcon = guild.iconURL({ dynamic: true });

      let rolemap = guild.roles.cache
        .sort((a, b) => b.position - a.position)
        .map((r) => r)
        .join(",");
      if (rolemap.length > 1024) rolemap = "To many roles to display";
      if (!rolemap) rolemap = "No roles";

      const embed = new EmbedBuilder()
        .setTitle(`${guildName} - Server Info`)
        .setColor("#000000")
        .setThumbnail(guildIcon)
        .addFields(
          { name: "Server ID", value: `${guildID}`, inline: true },
          { name: "Owner", value: `${guildOwner}`, inline: true },
          {
            name: "Server Creation Date",
            value: `<t:${guildCreationDate}>`,
            inline: true,
          },
          {
            name: `Member Count - ${totalMemberCount}`,
            value: `
            Members: ${memberCount}
            Bots: ${botCount}
            `,
            inline: true,
          },
          {
            name: `Channels - ${allChannelCount}`,
            value: `
            Text: ${textChannels}
            Voice: ${voiceChannels}
            `,
            inline: true,
          },
          {
            name: `Roles - ${guildRoleCount}`,
            value: `${rolemap.split(",").join(" ")}`,
            inline: true,
          },
          {
            name: `Total Server Boosts - ${totalGuildBoosts}`,
            value: "\u200b",
            inline: true,
          },
          {
            name: `Server Boost Tier - ${guildBoostTier}/3`,
            value: "\u200b",
            inline: true,
          }
        );
      await interaction.reply({ embeds: [embed] });
    } else if (interaction.options.getSubcommand() === "icon") {
      const guild = interaction.guild;
      const guildName = guild.name;
      const guildIcon = guild.iconURL({ dynamic: true });

      const embed = new EmbedBuilder()
        .setTitle(`${guildName} - Server Icon`)
        .setColor("#000000")
        .setImage(guildIcon);
      await interaction.reply({
        embeds: [embed],
      });
    }
  },
};
