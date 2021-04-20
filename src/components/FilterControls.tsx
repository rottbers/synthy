import React, { useMemo } from 'react';
import { RadioGroup, RadioOption } from './RadioGroup';
import { useSettingsState, useSettingsDispatch } from '../contexts/Settings';

import Lowpass from '../icons/Lowpass';
import Bandpass from '../icons/Bandpass';
import Highpass from '../icons/Highpass';

const FilterControls = () => {
  const { filter } = useSettingsState();
  const dispatchSetting = useSettingsDispatch();

  return useMemo(
    () => (
      <div className="my-4 px-4 sm:px-8 border-r-2 border-gray-200 w-full">
        <h3 className="text-gray-900 font-semibold text-lg mb-4">Filter</h3>
        <label
          htmlFor="filterFrequency"
          className="flex justify-between text-gray-700 mb-1"
        >
          <span>Cutoff </span>
          <span className="text-right">{filter.frequency}Hz</span>
        </label>
        <input
          name="filterFrequency"
          type="range"
          value={filter.frequency}
          onChange={(e) =>
            dispatchSetting({
              type: 'UPDATE_FILTER',
              filter: { frequency: e.target.valueAsNumber },
            })
          }
          step={1}
          min={0}
          max={20000}
          className="slider"
        />

        <p className="text-gray-700 mb-1 mt-2">Type</p>
        <RadioGroup
          name="filterType"
          selectedOption={filter.type}
          onChange={(e) =>
            dispatchSetting({
              type: 'UPDATE_FILTER',
              filter: { type: e.target.value },
            })
          }
        >
          <RadioOption value="lowpass">
            <Lowpass className="text-4xl m-1" />
            <span className="sr-only">Lowpass</span>
          </RadioOption>
          <RadioOption value="bandpass">
            <Bandpass className="text-4xl m-1" />
            <span className="sr-only">Bandpass</span>
          </RadioOption>
          <RadioOption value="highpass">
            <Highpass className="text-4xl m-1" />
            <span className="sr-only">Highpass</span>
          </RadioOption>
        </RadioGroup>
      </div>
    ),
    [filter, dispatchSetting]
  );
};

export default FilterControls;
