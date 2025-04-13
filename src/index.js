import "dotenv/config";

import {
  Client,
  IntentsBitField,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", async (c) => {
  console.log(`✅ ${c.user.tag} is online`);

  client.user.setStatus("invisible");

  try {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    if (!guild) {
      throw new Error("Guild not found in cache");
    }
    console.log("Found guild:", guild.name);

    // Get any text channel from the guild
    const channel = guild.channels.cache.find((ch) => ch.type === 0);
    if (!channel) {
      throw new Error("No text channels found in guild");
    }

    const invite = await channel.createInvite({
      maxAge: 0, // Never expires
      maxUses: 0, // Unlimited uses
    });

    console.log("Permanent server invite link:", invite.url);
  } catch (error) {
    console.error("Error in ready event:", error.message);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  if (interaction.commandName === "click") {
    const button = new ButtonBuilder()
      .setCustomId("test-button")
      .setLabel("Click me!")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({
      content: "Here is a button:",
      components: [row],
    });
  } else if (interaction.customId === "test-button") {
    const member = interaction.member;
    try {
      await member.timeout(60 * 1000, "U FOOOOOL!!!!");
      await interaction.reply({
        content: "haha u fool",
      });
    } catch (error) {
      console.error("Error timing out member:", error);
      await interaction.reply({
        content: "im not powerful enough",
      });
    }
  }

  if (interaction.commandName === "gamble") {
    const randomNum = Math.random();
    if (randomNum < 0.03) {
      const role = interaction.guild.roles.cache.find(
        (role) => role.name === "User"
      );
      if (role) {
        await interaction.member.roles.add(role);
        await interaction.reply({
          content: "You are now an admin!",
        });
      } else {
        await interaction.reply({
          content: "Admin role not found.",
        });
      }
    } else if (randomNum > 0.5) {
      try {
        await interaction.member.timeout(20 * 1000, "U FOOOOOL!!!!");
        await interaction.reply({
          content: "You have been timed out for 20 seconds!",
        });
      } catch (error) {
        console.error("Error timing out member:", error);
        await interaction.reply({
          content: "im not powerful enough",
        });
      }
    } else {
      await interaction.reply({
        content: "ur not adimn, but ur not timed out either",
      });
    }
  }

  if (interaction.commandName === "showavatar") {
    const id = interaction.user.id;
    const user = interaction.guild.members.cache.get(id);
    const userAvatar = user.user.displayAvatarURL();
    interaction.reply(userAvatar);
  }

  if (interaction.commandName === "r") {
    interaction.reply({
      content:
        "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⡀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣶⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣿⣿⣿⠿⠟⠛⠻⣿⠆⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣆⣀⣀⠀⣿⠂⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⠻⣿⣿⣿⠅⠛⠋⠈⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢼⣿⣿⣿⣃⠠⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣿⣿⣟⡿⠃⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣛⣛⣫⡄⠀⢸⣦⣀⠀⠀⠀⠀\n⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⡆⠸⣿⣿⣿⡷⠂⠨⣿⣿⣿⣿⣶⣦⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠀⣤⣾⣿⣿⣿⣿⡇⢀⣿⡿⠋⠁⢀⡶⠪⣉⢸⣿⣿⣿⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⢀⣿⣿⣿⣿⣿⣿⣿⣿⡏⢸⣿⣷⣿⣿⣷⣦⡙⣿⣿⣿⣿⣿⡏⠀⠀\n⠀⠀⠀⠈⣿⣿⣿⣿⣿⣿⣿⣿⣇⢸⣿⣿⣿⣿⣿⣷⣦⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀⠀\n⠀⠀⠀⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣄⠀⠀⠀⠀⠀⠀⠀⠀⠀\n⠀⠀⠀⠸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀\n⠀⠀⠀⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀\n⠀⠀⠀⢹⣿⣵⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣯⡁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
