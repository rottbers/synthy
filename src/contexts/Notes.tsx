import { createContext, useContext, useReducer } from 'react';

interface NotesState {
  [key: string]: 'on' | 'off';
}

type NotesEvent =
  | { type: 'NOTE_ON'; note: number; velocity: number }
  | { type: 'NOTE_OFF'; note: number }
  | { type: 'NOTES_OFF'; notes: number[] };

type State = [NotesState, NotesEvent?];

type Action =
  | { type: 'NOTE_ON'; note: number; velocity: number }
  | { type: 'NOTE_OFF'; note: number }
  | { type: 'NOTES_OFF' };

function reducer([state]: State, action: Action): State {
  switch (action.type) {
    case 'NOTE_ON': {
      if (state[action.note] && state[action.note] === 'off') {
        const notesState: NotesState = { ...state, [action.note]: 'on' };
        const notesEvent: NotesEvent = action;
        return [notesState, notesEvent];
      }
      return [state];
    }
    case 'NOTE_OFF': {
      if (state[action.note] && state[action.note] === 'on') {
        const notesState: NotesState = { ...state, [action.note]: 'off' };
        const notesEvent: NotesEvent = action;
        return [notesState, notesEvent];
      }
      return [state];
    }
    case 'NOTES_OFF': {
      const notes = Object.entries(state).reduce((acc: number[], [note, status]) => (status === 'on' ? [...acc, Number(note)] : acc), []); // prettier-ignore

      if (notes.length) {
        const notesState: NotesState = { ...state };
        notes.forEach((note) => (notesState[note] = 'off'));
        const notesEvent: NotesEvent = { type: action.type, notes };
        return [notesState, notesEvent];
      }
      return [state];
    }
  }
}

// generate key for each supported midi note (24/C1 - 110/D8)
const initialState: NotesState = {};
for (let i = 24; i <= 110; i++) initialState[i] = 'off';

const StateContext = createContext<State>([initialState]);
const DispatchContext = createContext<React.Dispatch<Action>>(() => null);

const NotesProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [initialState]);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

const useNotesState = () => useContext(StateContext)[0];
const useNotesEvent = () => useContext(StateContext)[1];
const useNotesDispatch = () => useContext(DispatchContext);

export { NotesProvider, useNotesState, useNotesEvent, useNotesDispatch };
