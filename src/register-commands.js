import "dotenv/config";
import { REST, Routes, ApplicationCommandOptionType } from "discord.js";

const commands = [
  {
    name: "r",
    description: "...test it out, i dare you",
  },
  {
    name: "click",
    description: "Shows a button you can click",
  },
  {
    name: "showavatar",
    description: "do it.",
  },
  {
    name: "gamble",
    description:
      "50% chance of getting timed out for 20 seconds, but 3% chance of becoming admin",
  },
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

const registerCommands = async () => {
  try {
    console.log("Registering slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log("Slash commands registered successfully!");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
};

registerCommands();
