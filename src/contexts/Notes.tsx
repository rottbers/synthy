import React, { createContext, useContext, useReducer } from 'react';

interface NotesState {
  [key: string]: 'on' | 'off';
}

type NotesEffect =
  | { type: 'TRIGGER_ATTACK'; note: number; velocity: number }
  | { type: 'TRIGGER_RELEASE'; note: number };

type State = [NotesState, NotesEffect?];

type Event =
  | { type: 'NOTE_ON'; note: number; velocity: number }
  | { type: 'NOTE_OFF'; note: number };

function reducer([state]: State, event: Event): State {
  if (!state[event.note]) return [state];

  switch (state[event.note]) {
    case 'off': {
      if (event.type === 'NOTE_ON') {
        const notesState = { ...state, [event.note]: 'on' };
        const notesEffect: NotesEffect = { type: 'TRIGGER_ATTACK', note: event.note, velocity: event.velocity }; // prettier-ignore
        return [notesState, notesEffect];
      }
      return [state];
    }
    case 'on': {
      if (event.type === 'NOTE_OFF') {
        const notesState = { ...state, [event.note]: 'off' };
        const notesEffect: NotesEffect = { type: 'TRIGGER_RELEASE', note: event.note }; // prettier-ignore
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
