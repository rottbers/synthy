import { useMemo } from 'react';
import { useSettingsState, useSettingsDispatch } from '../../contexts/Settings';

const EnvelopeControls = () => {
  const { envelope: { attack, decay, sustain, release } } = useSettingsState(); // prettier-ignore
  const dispatchSetting = useSettingsDispatch();

  return useMemo(
    () => (
      <div className="my-4 px-4 sm:px-8 border-r-2 border-gray-200 w-full">
        <h3 className="text-gray-900 font-semibold text-lg mb-4">Envelope</h3>
        <div className="flex flex-row">
          <div className="min-w-[8rem] w-full mr-4">
            <label
              htmlFor="attack"
              className="flex justify-between text-gray-700 mb-1"
            >
              <span>Attack </span>
              <span className="text-right">{attack * 1000}ms</span>
            </label>
            <input
              name="attack"
              id="attack"
              type="range"
              value={attack}
              onChange={(e) =>
                dispatchSetting({
                  type: 'UPDATE_ENVELOPE',
                  envelope: { attack: e.target.valueAsNumber },
                })
              }
              step={attack >= 0.1 ? 0.01 : 0.001}
              min={0}
              max={1}
              className="slider"
            />

            <label
              htmlFor="decay"
              className="flex justify-between text-gray-700 mb-1 mt-2"
            >
              <span>Decay </span>
              <span className="text-right">{decay * 1000}ms</span>
            </label>
            <input
              name="decay"
              id="decay"
              type="range"
              value={decay}
              onChange={(e) =>
                dispatchSetting({
                  type: 'UPDATE_ENVELOPE',
                  envelope: { decay: e.target.valueAsNumber },
                })
              }
              step={0.001}
              min={0.001}
              max={1}
              className="slider"
            />
          </div>

          <div className="min-w-[8rem] w-full">
            <label
              htmlFor="sustain"
              className="flex justify-between text-gray-700 mb-1"
            >
              <span>Sustain </span>
              <span className="text-right">{Math.round(sustain * 100)}%</span>
            </label>
            <input
              name="sustain"
              id="sustain"
              type="range"
              value={sustain}
              onChange={(e) =>
                dispatchSetting({
                  type: 'UPDATE_ENVELOPE',
                  envelope: { sustain: e.target.valueAsNumber },
                })
              }
              step={0.01}
              min={0}
              max={1}
              className="slider"
            />

            <label
              htmlFor="release"
              className="flex justify-between text-gray-700 mb-1 mt-2"
            >
              <span>Release </span>
              <span className="text-right">{release * 1000}ms</span>
            </label>
            <input
              name="release"
              id="release"
              type="range"
              value={release}
              onChange={(e) =>
                dispatchSetting({
                  type: 'UPDATE_ENVELOPE',
                  envelope: { release: e.target.valueAsNumber },
                })
              }
              step={release >= 0.1 ? 0.01 : 0.001}
              min={0}
              max={1}
              className="slider"
            />
          </div>
        </div>
      </div>
    ),
    [attack, decay, sustain, release, dispatchSetting]
  );
};

export default EnvelopeControls;
