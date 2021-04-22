import React, { useMemo } from 'react';
import { RadioGroup, RadioOption } from './RadioGroup';
import { useSettingsState, useSettingsDispatch } from '../contexts/Settings';

import Sine from '../icons/Sine';
import Saw from '../icons/Saw';
import Square from '../icons/Square';
import Triangle from '../icons/Triangle';

const OscillatorControls = () => {
  const { waveform } = useSettingsState();
  const dispatchSetting = useSettingsDispatch();

  return useMemo(
    () => (
      <div className="my-4 px-4 sm:px-8 border-r-2 border-gray-200 w-full">
        <h3 className="text-gray-900 font-semibold text-lg mb-4">Oscillator</h3>
        <p className="text-gray-700 mb-1">Waveform</p>
        <RadioGroup
          name="waveform"
          selectedOption={waveform}
          onChange={(e) =>
            dispatchSetting({
              type: 'UPDATE_WAVEFORM',
              // @ts-expect-error TODO
              waveform: e.target.value,
            })
          }
        >
          <RadioOption value="sine">
            <Sine className="text-4xl m-1" />
            <span className="sr-only">Sine</span>
          </RadioOption>
          <RadioOption value="sawtooth">
            <Saw className="text-4xl m-1" />
            <span className="sr-only">Saw</span>
          </RadioOption>
          <RadioOption value="square">
            <Square className="text-4xl m-1" />
            <span className="sr-only">Square</span>
          </RadioOption>
          <RadioOption value="triangle">
            <Triangle className="text-4xl m-1" />
            <span className="sr-only">Triangle</span>
          </RadioOption>
        </RadioGroup>
      </div>
    ),
    [waveform, dispatchSetting]
  );
};

export default OscillatorControls;
