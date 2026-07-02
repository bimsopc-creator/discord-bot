const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.on("ready", () => {
  console.log("Bot ist online!");
});

client.on("messageCreate", message => {
  if (message.author.bot) return;

  fs.appendFileSync(
    "messages.txt",
    `${message.author.username}: ${message.content}\n`
  );
});

client.login("MTUyMjIwOTM2NzAzMjU5ODYyMA.GWE_1d.SSQWG2xG5Uo1odZHtyAgOfvMgwyVBy2E5jrJU8");