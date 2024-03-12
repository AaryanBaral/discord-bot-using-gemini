import { Client, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
config();

import { GoogleGenerativeAI } from "@google/generative-ai";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


async function askPrompt(prompt) { 
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const result = await model.generateContent(prompt+", give result in less than 2000 characters");
    const response = await result.response;
    const text = response.text();
    return text;
  }

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ] }
);

client.on('messageCreate', async(message) => {
    if(message.author.bot) return ;
    const result = await askPrompt(message.content);
    const data = result.substring(0,result.length>2000?1950:-1);
    message.reply(`Here's your answer:  ${data} ......  `);
});


client.login(process.env.BOT_ACCESS_TOKEN);