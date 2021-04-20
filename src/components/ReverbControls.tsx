import React, { useMemo } from 'react';
import { useSettingsState, useSettingsDispatch } from '../contexts/Settings';

const FilterControls = () => {
  const { reverb } = useSettingsState();
  const dispatchSetting = useSettingsDispatch();

  return useMemo(
    () => (
      <div className="my-4 px-4 sm:px-8 w-full min-w-[12rem]">
        <h3 className="text-gray-900 font-semibold text-lg mb-4">Reverb</h3>

        <label
          htmlFor="reverbDecay"
          className="flex justify-between text-gray-700 mb-1 mt-2"
        >
          <span>Decay </span>
          <span className="text-right">{reverb.decay}s</span>
        </label>
        <input
          name="reverbDecay"
          type="range"
          value={reverb.decay}
          onChange={(e) =>
            dispatchSetting({
              type: 'UPDATE_REVERB',
              reverb: { decay: e.target.valueAsNumber },
            })
          }
          step={0.01}
          min={0.01}
          max={10}
          className="slider"
        />

        <label
          htmlFor="reverbWet"
          className="flex justify-between text-gray-700 mb-1 mt-2"
        >
          <span>Dry/wet </span>
          <span className="text-right">{Math.round(reverb.wet * 100)}%</span>
        </label>
        <input
          name="reverbWet"
          type="range"
          value={reverb.wet}
          onChange={(e) =>
            dispatchSetting({
              type: 'UPDATE_REVERB',
              reverb: { wet: e.target.valueAsNumber },
            })
          }
          step={0.01}
          min={0}
          max={0.5}
          className="slider"
        />
      </div>
    ),
    [reverb, dispatchSetting]
  );
};

export default FilterControls;
