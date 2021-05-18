import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import Player from '../components/Player';
import SettingsSection from '../components/SettingsSection';
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
          <div className="px-4 sm:px-8 flex justify-between items-center">
            <div className="font-black text-2xl text-gray-900">
              <h1 className="inline-block italic">Synthy</h1>
              <Link
                href={{ pathname: '/about', query: { recordingId } }}
                as="/about"
              >
                <a className="inline-block ml-2.5 sm:ml-[1.25rem] p-3 w-12 h-12 text-center leading-none bg-gray-200 hover:bg-gray-300 focus:outline-none focus-visible:ring ring-inset ring-blue-500">
                  <span className="sr-only">about</span>
                  <span aria-hidden="true">?</span>
                </a>
              </Link>
            </div>
            <Link href="/">
              <a className="-mr-1.5 p-3 bg-amber-200 hover:bg-amber-200 focus-visible:ring focus-visible:ring-inset ring-blue-500 focus:outline-none">
                <Logo className="text-2xl" aria-label="play yourself" />
              </a>
            </Link>
          </div>
          <Player recordingId={recordingId} />
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

export default ListenPage;
