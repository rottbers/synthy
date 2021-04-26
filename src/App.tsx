import React, { useState } from 'react';
import { start } from 'tone';

import Sine from './icons/Sine';
import Saw from './icons/Saw';
import Square from './icons/Square';
import Triangle from './icons/Triangle';

import Recoder from './components/Recorder';
import PatchSection from './components/PatchSection';
import KeysSection from './components/KeysSection';

import Keyboard from './components/Keyboard';
import MIDI from './components/MIDI';
import Synth from './components/Synth';

const App = () => {
  const [showAbout, setShowAbout] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  async function handleClick() {
    if (isInitialized) {
      setShowAbout(false);
      return;
    }

    await start();
    setIsInitialized(true);
    setShowAbout(false);
  }

  if (showAbout) {
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
          Play notes using your computer keyboard, MIDI controller or the
          onscreen keys.
        </p>

        <button
          onClick={handleClick}
          className="mt-4 font-semibold bg-gray-900 text-white py-2 px-8 rounded-sm self-center hover:bg-gray-800 focus:bg-gray-800 focus:outline-none focus:ring-2 disabled:bg-gray-500"
        >
          {isInitialized ? 'Go back' : 'Get started'}
        </button>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen grid grid-cols-1 grid-rows-[min-content,min-content,auto]">
        <div className="py-2 px-4 sm:px-8 flex justify-between items-center">
          <div className="font-black text-3xl text-gray-900">
            <h1 className="inline-block italic">Synthy</h1>
            <button
              onClick={() => setShowAbout(true)}
              className="inline-block underline ml-2 font-black focus:text-gray-700 hover:text-gray-700"
            >
              <span className="sr-only">about</span> ?
            </button>
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

export default App;
