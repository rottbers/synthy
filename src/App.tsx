import React, { useState } from 'react';

import OscillatorControls from './components/OscillatorControls';
import EnvelopeControls from './components/EnvelopeControls';
import FilterControls from './components/FilterControls';
import ReverbControls from './components/ReverbControls';
import OctaveControls from './components/OctaveControls';
import Keys from './components/Keys';

import Keyboard from './components/Keyboard';
import MIDI from './components/MIDI';
import Synth from './components/Synth';

import Arrow from './icons/Arrow';

const App = () => {
  const [showPatch, setShowPatch] = useState(true);

  return (
    <>
      <main className="min-h-screen grid grid-cols-1 grid-rows-[min-content,min-content,auto]">
        <div className="py-2 px-4 sm:px-8 flex justify-between items-center">
          <h1 className="font-black italic text-gray-900 text-3xl text-center underline">
            Synthy
          </h1>
        </div>

        <section>
          <div className="bg-green-300 px-4 sm:px-8 py-2 border-b-4 border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 group-focus:underline">
              Patch
            </h2>
            <button
              className="w-full focus:outline-none p-2 group"
              onClick={() => setShowPatch((currentValue) => !currentValue)}
            >
              <Arrow
                className={`text-gray-900 ml-auto transition duration-200 transform ${
                  showPatch ? 'rotate-90' : ''
                }`}
              />
              <span className="sr-only">
                {showPatch ? 'Hide patch' : 'Show patch'}
              </span>
            </button>
          </div>
          {showPatch && (
            <div className="flex flex-col sm:flex-row w-full overflow-x-auto overflow-y-hidden scrollbar-w-thin">
              <OscillatorControls />
              <EnvelopeControls />
              <FilterControls />
              <ReverbControls />
            </div>
          )}
        </section>

        <section className="flex flex-col h-full">
          <div className="bg-yellow-200 px-4 sm:px-8 py-2 border-b-4 border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 text-left group-focus:underline">
              Keys
            </h2>
            <OctaveControls />
          </div>
          <Keys />
        </section>
      </main>

      <Keyboard />
      <MIDI />
      <Synth />
    </>
  );
};

export default App;
