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
  ctx.reply('https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app');
});

bot.launch();

// Set webhook
bot.telegram.setWebhook(`https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app/${secretPath}`);

// Create a native Node.js HTTP server
const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method === 'POST' && req.url === secretPath) {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const update = JSON.parse(body);
        bot.handleUpdate(update);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (error) {
        console.error('Error parsing request body:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', error: error }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'not found' }));
  }
});

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Handle graceful shutdown
process.once('SIGINT', () => {
  bot.stop('SIGINT');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.once('SIGTERM', () => {
  bot.stop('SIGTERM');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

