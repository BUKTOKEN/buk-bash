// telegram-web-app.d.ts
interface TelegramWebApp {
    ready(): void;
    colorScheme: 'light' | 'dark';
  }
  
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
  