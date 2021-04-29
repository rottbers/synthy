import { useRouter } from 'next/router';
import Link from 'next/link';

import Sine from '../icons/Sine';
import Saw from '../icons/Saw';
import Square from '../icons/Square';
import Triangle from '../icons/Triangle';

const AboutPage = () => {
  const { query: { recordingId } } = useRouter(); // prettier-ignore

  return (
    <main className="h-screen p-4 flex flex-col text-center md:justify-center">
      <h1 className="font-black text-gray-900 italic text-4xl md:text-5xl text-center mt-8 md:mt-0 mb-2">
        Synthy
      </h1>
      <div className="mx-auto mb-2 overflow-x-hidden w-[30px]">
        <div className="w-[120px] text-3xl text-gray-600 flex flex-row motion-safe:animate-marquee">
          <Sine aria-hidden="true" />
          <Saw aria-hidden="true" />
          <Square aria-hidden="true" />
          <Triangle aria-hidden="true" />
        </div>
      </div>
      <p className="mb-4 text-gray-600 md:text-xl">
        Synthy is a web-based synth built with{' '}
        <a
          href="https://tonejs.github.io/"
          className="underline hover:text-gray-700 focus:text-gray-700"
        >
          Tone.js
        </a>
        .
      </p>
      <p className="mb-4 text-gray-600 md:text-xl">
        Play notes using your computer keyboard, MIDI controller or the onscreen
        keys.
      </p>
      <Link href={recordingId ? `/${recordingId}` : '/'}>
        <a className="mt-4 font-semibold bg-gray-900 text-white py-2 px-8 rounded-sm self-center hover:bg-gray-700 focus:bg-gray-700">
          Got it
        </a>
      </Link>
    </main>
  );
};

export default AboutPage;
