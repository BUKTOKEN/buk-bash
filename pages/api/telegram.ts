import { Telegraf } from 'telegraf';
import * as dotenv from 'dotenv';
import { IncomingMessage, ServerResponse, createServer } from 'node:http';

dotenv.config();

const BOT_TOKEN = process.env.PRIVATE_TELEGRAM!;
const GAME_URL = 'https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app'; // Replace with your game's URL

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  // if (req.method === 'POST') {
  //   let body = '';
  //   req.on('data', (chunk) => {
  //     body += chunk.toString();
  //   });

    const bot = new Telegraf(BOT_TOKEN);
    console.log('trigger');
    bot.start((ctx) => {
      ctx.reply('Welcome! Click the button below to play the game.', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Play Game', url: GAME_URL }
            ]
          ]
        }
      });
    });

    bot.launch();

    console.log('Bot is running...');

    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));
  // }
  });


// import { NextApiRequest, NextApiResponse } from 'next';
// import { Telegraf } from 'telegraf';
// import * as dotenv from 'dotenv';
// import { keyboard } from 'telegraf/typings/markup';
// const Extra = require('telegraf/extra')
// const Markup = require('telegraf/markup')

// dotenv.config();

// const BOT_TOKEN = process.env.PRIVATE_TELEGRAM!;
// const bot = new Telegraf(BOT_TOKEN);

// bot.start((ctx) => {
//   ctx.replyWithGame('bukslap24');
// });

// bot.on("callback_query:bukslap24", async (ctx) => {
//   await ctx.answerCallbackQuery({ url: "https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app" });
// });

// bot.command("start", async (ctx) => {
//   await ctx.replyWithGame("bukslap24", {
//     reply_markup: keyboard,
//     // Or you can use the api method here, according to your needs.
//   });
// });

// bot.on("callback_query:game_short_name", async (ctx) => {
//   const token = createToken(ctx.from.id.toString());
//   console.log("Token: " + token);
//   await ctx.answerCallbackQuery({ url: `https://settle-mints-game.netlify.app/?token=${token}` });
// });


// bot.launch();

// bot.telegram.setWebhook(`https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app`);

// const server = createServer((req: IncomingMessage, res: ServerResponse) => {
//   if (req.method === 'POST' && req.url === secretPath) {
//     let body = '';
//     req.on('data', (chunk) => {
//       body += chunk.toString();
//     });

//     req.on('end', () => {
//       try {
//         const update = JSON.parse(body);
//         bot.handleUpdate(update);
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ status: 'ok' }));
//       } catch (error) {
//         console.error('Error:', error);
//         res.writeHead(500, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ status: 'error', error: error }));
//       }
//     });
//   } else {
//     res.writeHead(404, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ status: 'not found' }));
//   }
// });

// server.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });

// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));
// const gameShortName = 'buk-bash'
// const gameUrl = 'https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app'

// const markup = Extra.markup(
//   Markup.inlineKeyboard([
//     Markup.gameButton('ðŸŽ® Play now!'),
//     Markup.urlButton('Telegraf help', 'https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app')
//   ])
// )

// bot.start(({ replyWithGame }) => replyWithGame(gameShortName))
// bot.start((ctx) => {
//   ctx.replyWithGame();
//   ctx.reply('Welcome! Click the link below to play the game.');
//   ctx.reply('https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app');
// });

// bot.launch();

// const handler = (req: NextApiRequest, res: NextApiResponse) => {
//   if (req.method === 'POST') {
//     try {
//       bot.handleUpdate(req.body, res);
//     } catch (error) {
//       console.error('Error handling update:', error);
//       res.status(500).send('Server Error');
//     }
//   } else {
//     res.status(404).send('Not Found');
//   }
// };

// export default handler;