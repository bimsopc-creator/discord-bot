const { Client, GatewayIntentBits } = require("discord.js");
const mongoose = require("mongoose");
const OpenAI = require("openai");

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

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB verbunden"))
  .catch(err => console.log("Mongo Error:", err));

// Memory Schema
const Message = mongoose.model("Message", {
  user: String,
  text: String
});

client.on("ready", () => {
  console.log("Bot ist online!");
});

// Codewort
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content;

  // 🔥 Codewort
  if (text.toLowerCase().includes("bot active")) {
    return message.reply("Bot aktiv 😄");
  }

  // 💾 Speichern in MongoDB
  await Message.create({
    user: message.author.username,
    text: text
  });

  try {
    // 📚 Letzte Messages holen
    const history = await Message.find().sort({ _id: -1 }).limit(20);

    const context = history
      .map(m => `${m.user}: ${m.text}`)
      .join("\n");

    // 🤖 KI Antwort
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Du bist ein normaler Discord User.
Schreibe natürlich, locker, menschlich.

Chat Verlauf:
${context}
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
