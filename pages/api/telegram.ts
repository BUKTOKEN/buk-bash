import { NextApiRequest, NextApiResponse } from 'next';
import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.PRIVATE_TELEGRAM!;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Welcome! Click the link below to play the game.');
  ctx.reply('https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app');
});

bot.launch();

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      bot.handleUpdate(req.body, res);
    } catch (error) {
      console.error('Error handling update:', error);
      res.status(500).send('Server Error');
    }
  } else {
    res.status(404).send('Not Found');
  }
};

export default handler;
