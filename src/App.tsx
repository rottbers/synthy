import React from 'react';

import OscillatorControls from './components/OscillatorControls';
import EnvelopeControls from './components/EnvelopeControls';
import FilterControls from './components/FilterControls';
import ReverbControls from './components/ReverbControls';
import OctaveControls from './components/OctaveControls';
import Keys from './components/Keys';

import Keyboard from './components/Keyboard';
import MIDI from './components/MIDI';
import Synth from './components/Synth';

const App = () => (
  <>
    <main className="min-h-screen grid grid-cols-1 grid-rows-[min-content,min-content,auto]">
      <div className="p-2">
        <h1 className="font-black italic text-5xl text-center underline mb-2">
          Synthy
        </h1>
      </div>
      <section>
        <div className="bg-green-300 px-4 sm:px-8 py-2 border-b-4 border-gray-700">
          <h2 className="text-xl font-bold text-gray-900">Parameters</h2>
        </div>
        <div className="flex flex-row w-full overflow-x-auto scrollbar-w-thin">
          <OscillatorControls />
          <EnvelopeControls />
          <FilterControls />
          <ReverbControls />
        </div>
      </section>

      <section className="flex flex-col">
        <div className="bg-green-300 px-4 sm:px-8 py-2 border-b-4 border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Keys</h2>
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

export default App;
