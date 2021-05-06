import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import Player from '../components/Player';
import PatchSection from '../components/PatchSection';
import KeysSection from '../components/KeysSection';

import Keyboard from '../components/Keyboard';
import MIDI from '../components/MIDI';
import Synth from '../components/Synth';

import Logo from '../icons/Logo';

const ListenPage = () => {
  const { query } = useRouter();

  const recordingId = (() => {
    if (typeof query.recordingId === 'object') return query.recordingId[0];
    return query.recordingId;
  })();

  return (
    <>
      <Head>
        <title>Listen | Synthy</title>
      </Head>
      <main className="min-h-screen grid grid-cols-1 grid-rows-[min-content,min-content,auto]">
        <div className="flex flex-col">
          <div className="py-2 px-4 sm:px-8 flex justify-between items-center">
            <div className="font-black text-gray-900 text-3xl text-center">
              <h1 className="inline-block italic">Synthy</h1>
              <Link
                href={{ pathname: '/about', query: { recordingId } }}
                as="/about"
              >
                <a className="inline-block underline ml-2 focus:text-gray-700 hover:text-gray-700">
                  <span className="sr-only">about</span>
                  <span aria-hidden="true">?</span>
                </a>
              </Link>
            </div>
            <Link href="/">
              <a className="-mr-1 p-2 rounded-full text-2xl text-gray-900 focus:bg-gray-100 hover:bg-gray-100">
                <Logo className="text-2xl" aria-label="play yourself" />
              </a>
            </Link>
          </div>
          <Player recordingId={recordingId} />
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

export default ListenPage;
