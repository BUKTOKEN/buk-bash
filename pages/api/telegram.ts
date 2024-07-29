import { Telegraf } from 'telegraf';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import * as dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.PRIVATE_TELEGRAM!;
const secretPath = '/bukinbash'; // Change this to your secret path
const port = process.env.PORT || 3000;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome! Click the link below to play the game.');
  ctx.reply('https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app/');
});

bot.launch();
