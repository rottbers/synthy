import { createContext, useContext, useReducer } from 'react';

interface NotesState {
  [key: string]: 'on' | 'off';
}

type NotesEffect =
  | { type: 'NOTE_ON'; note: number; velocity: number }
  | { type: 'NOTE_OFF'; note: number }
  | { type: 'NOTES_OFF'; notes: number[] };

type State = [NotesState, NotesEffect?];

type Event =
  | { type: 'NOTE_ON'; note: number; velocity: number }
  | { type: 'NOTE_OFF'; note: number }
  | { type: 'NOTES_OFF' };

function reducer([state]: State, event: Event): State {
  switch (event.type) {
    case 'NOTE_ON': {
      if (state[event.note] && state[event.note] === 'off') {
        const notesState: NotesState = { ...state, [event.note]: 'on' };
        const notesEffect: NotesEffect = event;
        return [notesState, notesEffect];
      }
      return [state];
    }
    case 'NOTE_OFF': {
      if (state[event.note] && state[event.note] === 'on') {
        const notesState: NotesState = { ...state, [event.note]: 'off' };
        const notesEffect: NotesEffect = event;
        return [notesState, notesEffect];
      }
      return [state];
    }
    case 'NOTES_OFF': {
      const notes = Object.entries(state).reduce((acc: number[], [note, status]) => (status === 'on' ? [...acc, Number(note)] : acc), []); // prettier-ignore

      if (notes.length) {
        const notesState: NotesState = { ...state };
        notes.forEach((note) => (notesState[note] = 'off'));
        const notesEffect: NotesEffect = { type: event.type, notes };
        return [notesState, notesEffect];
      }
      return [state];
    }
  }
}

// generate key for each supported midi note (24/C1 - 110/D8)
const initialState: NotesState = {};
for (let i = 24; i <= 110; i++) initialState[i] = 'off';

const NotesStateContext = createContext<State>([initialState]);
const NotesDispatchContext = createContext<React.Dispatch<Event>>(() => null);

const NotesProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, [initialState]);

  return (
    <NotesStateContext.Provider value={state}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesStateContext.Provider>
  );
};

const useNotesState = () => useContext(NotesStateContext)[0];
const useNotesEffect = () => useContext(NotesStateContext)[1];
const useNotesDispatch = () => useContext(NotesDispatchContext);

export { NotesProvider, useNotesState, useNotesEffect, useNotesDispatch };
