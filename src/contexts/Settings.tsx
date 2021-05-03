import React, { createContext, useContext, useReducer } from 'react';
import {
  Octave,
  Velocity,
  Waveform,
  Envelope,
  Filter,
  Reverb,
  Settings,
} from '../shared/types';

type State = Settings;

type Event =
  | { type: 'DECREMENT_OCTAVE' | 'INCREMENT_OCTAVE' | 'DECREMENT_VELOCITY' | 'INCREMENT_VELOCITY' } // prettier-ignore
  | { type: 'UPDATE_OCTAVE'; octave: Octave }
  | { type: 'UPDATE_WAVEFORM'; waveform: Waveform }
  | { type: 'UPDATE_ENVELOPE'; envelope: Partial<Envelope> }
  | { type: 'UPDATE_FILTER'; filter: Partial<Filter> }
  | { type: 'UPDATE_REVERB'; reverb: Partial<Reverb> };

function reducer(state: State, event: Event): State {
  switch (event.type) {
    case 'INCREMENT_OCTAVE': {
      const octave = state.octave === 7 ? state.octave : state.octave + 1;
      return { ...state, octave };
    }
    case 'DECREMENT_OCTAVE': {
      const octave = state.octave === 1 ? state.octave : state.octave - 1;
      return { ...state, octave };
    }
    case 'UPDATE_OCTAVE': {
      let octave = event.octave;
      if (isNaN(octave)) octave = state.octave;
      if (octave > 7) octave = 7;
      if (octave < 1) octave = 1;
      return { ...state, octave };
    }
    case 'INCREMENT_VELOCITY': {
      const velocities: Velocity[] = [1, 20, 40, 60, 80, 100, 127];
      const index = velocities.indexOf(state.velocity);
      const velocity = index === velocities.length - 1 ? state.velocity : velocities[index + 1]; // prettier-ignore
      return { ...state, velocity };
    }
    case 'DECREMENT_VELOCITY': {
      const velocities: Velocity[] = [1, 20, 40, 60, 80, 100, 127];
      const index = velocities.indexOf(state.velocity);
      const velocity = index === 0 ? state.velocity : velocities[index - 1];
      return { ...state, velocity };
    }
    case 'UPDATE_WAVEFORM': {
      const waveforms: Waveform[] = ['sine', 'sawtooth','square', 'triangle']; // prettier-ignore
      const waveform = waveforms.includes(event.waveform)
        ? event.waveform
        : state.waveform;
      return { ...state, waveform };
    }
    case 'UPDATE_ENVELOPE': {
      const envelope = { ...state.envelope, ...event.envelope };
      return { ...state, envelope };
    }
    case 'UPDATE_FILTER': {
      const filter = { ...state.filter, ...event.filter };
      return { ...state, filter };
    }
    case 'UPDATE_REVERB': {
      const reverb = { ...state.reverb, ...event.reverb };
      return { ...state, reverb };
    }
    default:
      return state;
  }
}

const initialState: State = {
  octave: 4,
  velocity: 100,
  waveform: 'sawtooth',
  envelope: { attack: 0.05, decay: 0.5, sustain: 0.5, release: 1 },
  filter: { type: 'lowpass', frequency: 2500 },
  reverb: { wet: 0.3, decay: 6 },
};

const SettingsStateContext = createContext<State>(initialState);
const SettingsDispatchContext = createContext<React.Dispatch<Event>>(
  () => null
);

const SettingsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>
        {children}
      </SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  );
};

const useSettingsState = () => useContext(SettingsStateContext);
const useSettingsDispatch = () => useContext(SettingsDispatchContext);

export { SettingsProvider, useSettingsState, useSettingsDispatch };
