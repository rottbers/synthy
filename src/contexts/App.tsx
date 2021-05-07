import { createContext, useContext, useReducer } from 'react';

type Octave = number; // 1 | 2 | 3 | 4 | 5 | 6 | 7;
type Velocity = 1 | 20 | 40 | 60 | 80 | 100 | 127;

interface State {
  audioStarted: boolean;
  showSettings: boolean;
  octave: Octave;
  velocity: Velocity;
}

type Action =
  | { type: 'TOGGLE_SHOW_SETTINGS' | 'AUDIO_STARTED' | 'DECREMENT_OCTAVE' | 'INCREMENT_OCTAVE' | 'DECREMENT_VELOCITY' | 'INCREMENT_VELOCITY'; } // prettier-ignore
  | { type: 'UPDATE_OCTAVE'; octave: Octave };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'AUDIO_STARTED': {
      return { ...state, audioStarted: true };
    }
    case 'TOGGLE_SHOW_SETTINGS': {
      return { ...state, showSettings: !state.showSettings };
    }
    case 'INCREMENT_OCTAVE': {
      const octave = state.octave === 7 ? state.octave : state.octave + 1;
      return { ...state, octave };
    }
    case 'DECREMENT_OCTAVE': {
      const octave = state.octave === 1 ? state.octave : state.octave - 1;
      return { ...state, octave };
    }
    case 'UPDATE_OCTAVE': {
      let octave = action.octave;
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
    default:
      return state;
  }
}

const initialState: State = {
  audioStarted: false,
  showSettings: false,
  octave: 4,
  velocity: 100,
};

const StateContext = createContext<State>(initialState);
const DispatchContext = createContext<React.Dispatch<Action>>(() => null);

const AppProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const useAppState = () => useContext(StateContext);
const useAppDispatch = () => useContext(DispatchContext);

export { AppProvider, useAppState, useAppDispatch };
