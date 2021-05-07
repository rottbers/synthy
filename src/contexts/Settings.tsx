import { createContext, useContext, useReducer } from 'react';
import { Waveform, Envelope, Filter, Reverb, Settings } from '../shared/types';

type State = Settings;

type Action =
  | { type: 'UPDATE_WAVEFORM'; waveform: Waveform }
  | { type: 'UPDATE_ENVELOPE'; envelope: Partial<Envelope> }
  | { type: 'UPDATE_FILTER'; filter: Partial<Filter> | undefined }
  | { type: 'UPDATE_REVERB'; reverb: Partial<Reverb> };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'UPDATE_WAVEFORM': {
      const waveforms: Waveform[] = ['sine', 'sawtooth','square', 'triangle']; // prettier-ignore
      const waveform = waveforms.includes(action.waveform)
        ? action.waveform
        : state.waveform;
      return { ...state, waveform };
    }
    case 'UPDATE_ENVELOPE': {
      const envelope = { ...state.envelope, ...action.envelope };
      return { ...state, envelope };
    }
    case 'UPDATE_FILTER': {
      const filter = { ...state.filter, ...action.filter };
      return { ...state, filter };
    }
    case 'UPDATE_REVERB': {
      const reverb = { ...state.reverb, ...action.reverb };
      return { ...state, reverb };
    }
    default:
      return state;
  }
}

const initialState: State = {
  waveform: 'sawtooth',
  envelope: { attack: 0.05, decay: 0.5, sustain: 0.5, release: 1 },
  filter: { type: 'lowpass', frequency: 2500 },
  reverb: { wet: 0.3, decay: 6 },
};

const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => null);

const SettingsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const useSettingsState = () => useContext(StateContext);
const useSettingsDispatch = () => useContext(DispatchContext);

export { SettingsProvider, useSettingsState, useSettingsDispatch };
