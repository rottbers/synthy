import Link from 'next/link';
import Head from 'next/head';

import Recoder from '../components/Recorder';
import SettingsSection from '../components/SettingsSection';
import KeysSection from '../components/KeysSection';

import Keyboard from '../components/Keyboard';
import MIDI from '../components/MIDI';
import Synth from '../components/Synth';

const IndexPage = () => {
  return (
    <>
      <Head>
        <title>Synthy</title>
      </Head>
      <main className="min-h-screen grid grid-cols-1 grid-rows-[min-content,min-content,auto]">
        <div className="px-4 sm:px-8 flex justify-between items-center">
          <div className="font-black text-2xl text-gray-900">
            <h1 className="inline-block italic">Synthy</h1>
            <Link href="/about">
              <a className="inline-block ml-2.5 sm:ml-[1.25rem] p-3 w-12 h-12 text-center leading-none bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring ring-inset ring-blue-500">
                <span className="sr-only">about</span>
                <span aria-hidden="true">?</span>
              </a>
            </Link>
          </div>
          <Recoder />
        </div>

        <SettingsSection />
        <KeysSection />
      </main>

      <Keyboard />
      <MIDI />
      <Synth />
    </>
  );
};

export default IndexPage;
