import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import type { NextApiRequest, NextApiResponse } from 'next';

dotenv.config();

const BOT_TOKEN = process.env.PRIVATE_TELEGRAM!;
const GAME_URL = 'https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app';

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply('Stop BUKin about and clck play', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Play Game', url: GAME_URL }]
      ]
    }
  });
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const update = req.body;

      // Ensure that the update contains the 'message' field
      if ('message' in update || 'callback_query' in update || 'inline_query' in update) {
        await bot.handleUpdate(update);
      }

      res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Error handling update:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Start the bot only once in non-production environments
if (process.env.NODE_ENV !== 'production') {
  bot.launch();
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));