import type { AppProps } from 'next/app';
import Head from 'next/head';
import { NotesProvider } from '../contexts/Notes';
import { SettingsProvider } from '../contexts/Settings';
import '../tailwind.css';

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta property="og:image" content="https://synthy.netlify.app/ogimage.png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.webmanifest" />
    </Head>
    <SettingsProvider>
      <NotesProvider>
        <Component {...pageProps} />
      </NotesProvider>
    </SettingsProvider>
  </>
);

export default App;
