import Link from 'next/link';
import Head from 'next/head';

import Recoder from '../components/Recorder';
import PatchSection from '../components/PatchSection';
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
        <div className="py-2 px-4 sm:px-8 flex justify-between items-center">
          <div className="font-black text-3xl text-gray-900">
            <h1 className="inline-block italic">Synthy</h1>
            <Link href="/about">
              <a className="inline-block underline ml-2 font-black focus:text-gray-700 hover:text-gray-700">
                <span className="sr-only">about</span>
                <span aria-hidden="true">?</span>
              </a>
            </Link>
          </div>
          <Recoder />
        </div>

        <PatchSection />
        <KeysSection />
      </main>

      <Keyboard />
      <MIDI />
      <Synth />
    </>
  );
};

export default IndexPage;
