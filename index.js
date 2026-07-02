const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Memory laden
function loadMemory() {
  try {
    return JSON.parse(fs.readFileSync("./memory.json", "utf8"));
  } catch {
    return [];
  }
}

// Memory speichern
function saveMemory(data) {
  fs.writeFileSync("./memory.json", JSON.stringify(data, null, 2));
}

let memory = loadMemory();

client.on("ready", () => {
  console.log("Bot läuft mit Memory!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;

  // 🔥 Codewort
  if (text.toLowerCase().includes("bot active")) {
    return message.reply("Bot aktiv 😄");
  }

  // 🧠 speichern
  memory.push(text);

  if (memory.length > 50) memory.shift();

  saveMemory(memory);

  // 🤖 einfache Antwort
  if (text.includes("?")) {
    message.reply("Ich hab mir das gemerkt 👍");
  }
});

client.login(process.env.TOKEN);
