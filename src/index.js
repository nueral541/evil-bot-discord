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
    // Log available guilds for debugging
    console.log('Available guilds:', Array.from(client.guilds.cache.values()).map(g => ({
      name: g.name,
      id: g.id
    })));

    // Get specific guild using GUILD_ID from env
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    if (!guild) {
      throw new Error(`Guild ${process.env.GUILD_ID} not found`);
    }
    console.log('Found guild:', guild.name);

    // Get specific channel
    const channel = guild.channels.cache.get(process.env.CHANNEL_ID);
    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await guild.members.fetch(process.env.ID);
    if (!member) {
      throw new Error('Member not found');
    }

    const invite = await channel.createInvite({
      maxAge: 120,
      maxUses: 1,
      unique: true,
    });

    await member.send(`Here's your way back in: ${invite.url}`);
    console.log('Invite sent successfully');
  } catch (error) {
    console.error('Error in ready event:', error.message);
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
