import { ThirdwebProvider } from "@thirdweb-dev/react";
import type { AppProps } from "next/app";
import Script from 'next/script';
import Head from "next/head";
import { BaseSepoliaTestnet } from "@thirdweb-dev/chains";
import "./styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider  supportedChains={[BaseSepoliaTestnet]} clientId={process.env.NEXT_PUBLIC_CLIENT_ID}>
      <Head>
        <title>BUK Bash</title>
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no"/>
        <meta
          name="description"
          content="BUK Bash - NFT reward"
        />
        <meta name="keywords" content="buk bash" />
      </Head>
      <Script
        src="https://telegram.org/js/telegram-web-app.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Telegram Web App SDK loaded.');
        }}
      />
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}

export default MyApp;
