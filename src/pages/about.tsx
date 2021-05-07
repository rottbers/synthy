import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import Sine from '../icons/Sine';
import Saw from '../icons/Saw';
import Square from '../icons/Square';
import Triangle from '../icons/Triangle';
import Record from '../icons/Record';
import Share from '../icons/Share';
import Play from '../icons/Play';
import Cross from '../icons/Cross';
import Logo from '../icons/Logo';

const AboutPage = () => {
  const { query: { recordingId } } = useRouter(); // prettier-ignore

  return (
    <>
      <Head>
        <title>About | Synthy</title>
      </Head>
      <main className="h-screen p-4 mx-auto max-w-lg flex flex-col md:justify-center text-gray-600">
        <h1 className="font-black text-gray-900 italic text-4xl md:text-5xl text-center mt-4 md:mt-0 mb-4">
          Synthy
        </h1>
        <p className="mb-2 md:text-xl text-center">
          A web-based polysynth built on{' '}
          <a
            href="https://tonejs.github.io/"
            className="underline hover:text-gray-900 focus:text-gray-900"
          >
            Tone.js
          </a>
          .
        </p>
        <div className="mx-auto md:mb-2 overflow-x-hidden w-[30px]">
          <div className="w-[120px] text-3xl flex flex-row motion-safe:animate-marquee">
            <Sine aria-hidden="true" />
            <Saw aria-hidden="true" />
            <Square aria-hidden="true" />
            <Triangle aria-hidden="true" />
          </div>
        </div>

        <h2 className="font-bold text-gray-900 md:text-xl md:mb-1">Play</h2>
        <p className="mb-6 md:text-xl">
          Play ({' '}
          <Logo
            className="inline-block text-gray-900"
            aria-label="Play yourself icon"
          />{' '}
          ) notes using your computer keyboard, MIDI controller or the onscreen
          keys.
        </p>
        <h2 className="font-bold text-gray-900 md:text-xl md:mb-1">Record</h2>
        <p className="mb-6 md:text-xl">
          Record ({' '}
          <Record
            className="inline-block text-gray-900"
            aria-label="Record icon"
          />{' '}
          ) notes played and then play ({' '}
          <Play
            className="inline-block text-gray-900 transform translate-x-[10%]"
            aria-label="Play recording icon"
          />{' '}
          ) the notes back or scrap the recording ({' '}
          <Cross
            className="inline-block text-gray-900"
            aria-label="Scrap recording icon"
          />{' '}
          ).
        </p>
        <h2 className="font-bold text-gray-900 md:text-xl md:mb-1">Share</h2>
        <p className="mb-6 md:text-xl">
          Share ({' '}
          <Share
            className="inline-block text-gray-900"
            aria-label="Share icon"
          />{' '}
          ) the recording along with its patch via URL.
        </p>
        <Link href={recordingId ? `/${recordingId}` : '/'}>
          <a className="mt-6 font-semibold bg-gray-900 text-white py-2 px-8 rounded-sm self-center hover:bg-gray-700 focus:bg-gray-700">
            Got it, go back.
          </a>
        </Link>
      </main>
    </>
  );
};

export default AboutPage;
