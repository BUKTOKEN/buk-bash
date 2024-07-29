// const { Telegraf } = require('telegraf');

// const bot = new Telegraf(process.env.PRIVATE_TELEGRAM);

// bot.start((ctx) => {
//   ctx.reply('Bukin welcum! Click the link below to play the game.');
//   ctx.reply('https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app/');
// });

// bot.launch();

// // Set up a webhook to keep the bot running
// app.use(bot.webhookCallback('/secret-hook'));

// bot.telegram.setWebhook('https://buk-bash-git-mobile-buks-projects-c5fbd1d8.vercel.app/secret-hook');

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

// app.listen(3000, () => {
//   console.log('Bot server running on port 3000');
// });