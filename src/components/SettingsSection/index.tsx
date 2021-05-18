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
      <div className="bg-gray-100 text-gray-900 px-4 sm:px-8 py-2 border-b-4 border-gray-700 flex justify-between items-center hover:bg-gray-200">
        <h2 className="text-xl font-bold">Patch</h2>
        <button
          className="w-full focus:outline-none group"
          onClick={() => dispatchApp({ type: 'TOGGLE_SHOW_SETTINGS' })}
        >
          <div className="ml-auto w-min p-2 rounded-full group-focus-visible:ring ring-blue-400">
            <Arrow
              className={` transition duration-200 transform ${
                showSettings ? 'rotate-90' : ''
              }`}
              aria-label={showSettings ? 'Hide patch' : 'Show patch'}
            />
          </div>
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
