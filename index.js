const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

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

// einfacher „Style Speicher“
let memory = [];

client.on("ready", () => {
  console.log("Bot ist online!");
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const text = message.content.toLowerCase();

  // 🔥 CODEWORT
  if (text.includes("bot active")) {
    return message.reply("Bot aktiv 😄");
  }

  // Speicher dein Schreibstil
  memory.push(message.content);
  if (memory.length > 30) memory.shift();

  try {

    const style = memory.join("\n");

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
Du bist ein normaler Discord User.
Du schreibst natürlich wie ein Mensch im Chat.
Du passt dich dem Schreibstil an:

STIL BEISPIELE:
${style}

Regeln:
- kurz antworten
- locker schreiben
- Emojis nur manchmal
- nicht über KI sprechen
`
        },
        {
          role: "user",
          content: message.content
        }
      ]
    });

    message.reply(response.choices[0].message.content);

  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.TOKEN);
