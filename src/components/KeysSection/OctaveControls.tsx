import { useMemo } from 'react';
import { useAppState, useAppDispatch } from '../../contexts/App';

import Plus from '../../icons/Plus';
import Minus from '../../icons/Minus';

const OctaveControls = () => {
  const { octave } = useAppState();
  const dispatchApp = useAppDispatch();

  return useMemo(
    () => (
      <div>
        <label className="sr-only" htmlFor="octave">
          Octave
        </label>
        <div className="flex">
          <button
            aria-hidden="true"
            disabled={octave <= 1}
            onClick={() => dispatchApp({ type: 'DECREMENT_OCTAVE' })}
            className="p-2 text-gray-900 rounded-sm bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:outline-none disabled:text-gray-500 disabled:hover:bg-gray-200"
          >
            <Minus />
          </button>
          <input
            type="number"
            name="octave"
            id="octave"
            min={1}
            max={7}
            value={octave}
            onChange={(e) =>
              dispatchApp({
                type: 'UPDATE_OCTAVE',
                octave: e.target.valueAsNumber,
              })
            }
            className="text-center w-8 bg-transparent p-1 mx-2 rounded-sm focus:ring-2 focus:outline-none"
          />
          <button
            aria-hidden="true"
            disabled={octave >= 7}
            onClick={() => dispatchApp({ type: 'INCREMENT_OCTAVE' })}
            className="p-2 text-gray-900 rounded-sm bg-gray-200 hover:bg-gray-300 focus:ring-2 focus:outline-none disabled:text-gray-500 disabled:hover:bg-gray-200"
          >
            <Plus />
          </button>
        </div>
      </div>
    ),
    [octave, dispatchApp]
  );
};

export default OctaveControls;
