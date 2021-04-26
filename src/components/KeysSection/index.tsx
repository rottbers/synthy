import React from 'react';
import OctaveControls from './OctaveControls';
import Keys from './Keys';

const KeysSection = () => (
  <section className="flex flex-col h-full">
    <div className="bg-gray-600 text-white px-4 sm:px-8 py-2 border-b-4 border-gray-700 flex justify-between items-center">
      <h2 className="text-xl font-bold text-left">Keys</h2>
      <OctaveControls />
    </div>
    <Keys />
  </section>
);

export default KeysSection;
