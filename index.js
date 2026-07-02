const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
  console.log("Bot ist online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;

  // Codewort
  if (text.toLowerCase().includes("bot active")) {
    return message.reply("Bot aktiv 😄");
  }

  // Memory speichern
  memory.push({
    user: message.author.username,
    text: text
  });

  if (memory.length > 100) memory.shift();

  saveMemory(memory);

  try {
    const context = memory
      .slice(-20)
      .map(m => `${m.user}: ${m.text}`)
      .join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Du bist ein normaler Discord User.
Schreibe natürlich, locker und menschlich.

Hier ist Chat Verlauf:
${context}

Regeln:
- kurz antworten
- manchmal Emojis
- wie echter User schreiben
`
        },
        {
          role: "user",
          content: text
        }
      ]
    });

    message.reply(response.choices[0].message.content);

  } catch (err) {
    console.log("Fehler:", err);
  }
});

client.login(process.env.TOKEN);
