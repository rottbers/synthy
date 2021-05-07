import { useAppState, useAppDispatch } from '../../contexts/App';

import OscillatorControls from './OscillatorControls';
import EnvelopeControls from './EnvelopeControls';
import FilterControls from './FilterControls';
import ReverbControls from './ReverbControls';

import Arrow from '../../icons/Arrow';

const SettingsSection = () => {
  const { showSettings } = useAppState();
  const dispatchApp = useAppDispatch();

  return (
    <section>
      <div className="bg-gray-600 text-white px-4 sm:px-8 py-2 border-b-4 border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Patch</h2>
        <button
          className="w-full focus:outline-none p-2 group"
          onClick={() => dispatchApp({ type: 'TOGGLE_SHOW_SETTINGS' })}
        >
          <Arrow
            className={`ml-auto transition duration-200 transform ${
              showSettings ? 'rotate-90' : ''
            }`}
            aria-label={showSettings ? 'Hide patch' : 'Show patch'}
          />
        </button>
      </div>
      {showSettings && (
        <div className="flex flex-col md:flex-row w-full overflow-x-auto overflow-y-hidden scrollbar-w-thin">
          <OscillatorControls />
          <EnvelopeControls />
          <FilterControls />
          <ReverbControls />
        </div>
      )}
    </section>
  );
};

export default SettingsSection;
