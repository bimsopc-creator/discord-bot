const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

// Discord Bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

client.on("ready", () => {
  console.log("🤖 Bot ist online!");
});

// KI Antwort (Auto Chat)
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  try {
    const prompt = `
Du bist ein Discord User.
Antworte locker, kurz und mit Emojis.

Nachricht: ${message.content}

Wenn es keine Antwort braucht, schreibe: NO_REPLY
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Du bist ein hilfreicher Discord User."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const text = response.choices[0].message.content;

    if (!text.includes("NO_REPLY")) {
      message.reply(text);
    }

  } catch (err) {
    console.log("Fehler:", err);
  }
});

// LOGIN (WICHTIG: über Railway Variable)
client.login(process.env.TOKEN);
