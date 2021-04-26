import React, { useEffect, useReducer } from 'react';
import { Transport } from 'tone';
import { useNotesDispatch, useNotesEffect } from '../contexts/Notes';

import Record from '../icons/Record';
import Play from '../icons/Play';
import Stop from '../icons/Stop';
import Cross from '../icons/Cross';

type NotesEffect =
  | { type: 'TRIGGER_ATTACK'; note: number; velocity: number; time: number }
  | { type: 'TRIGGER_RELEASE'; note: number; time: number };

type Recording = NotesEffect[];

interface State {
  status: 'idle' | 'recording' | 'recorded' | 'playback';
  recording: Recording;
  startTime: number;
  duration: number;
}

type Event =
  | { type: 'SCRAP_RECORDING' | 'START_PLAYBACK' | 'STOP_PLAYBACK' }
  | { type: 'START_RECORDING'; startTime: number }
  | { type: 'STOP_RECORDING'; duration: number }
  | { type: 'ADD_NOTE_EFFECT'; effect: NotesEffect };

const initialState: State = {
  status: 'idle',
  recording: [],
  startTime: 0,
  duration: 0,
};

function reducer(state: State, event: Event): State {
  switch (state.status) {
    case 'idle': {
      switch (event.type) {
        case 'START_RECORDING': {
          const startTime = event.startTime;
          return { ...state, startTime, recording: [], status: 'recording' };
        }
        default:
          return state;
      }
    }
    case 'recording': {
      switch (event.type) {
        case 'STOP_RECORDING': {
          const duration = event.duration;
          return { ...state, duration, status: 'recorded' };
        }
        case 'ADD_NOTE_EFFECT': {
          const recording = [...state.recording, event.effect];
          return { ...state, recording };
        }
        default:
          return state;
      }
    }
    case 'recorded': {
      switch (event.type) {
        case 'SCRAP_RECORDING': {
          return { ...initialState };
        }
        case 'START_PLAYBACK': {
          return { ...state, status: 'playback' };
        }
        default:
          return state;
      }
    }
    case 'playback': {
      switch (event.type) {
        case 'STOP_PLAYBACK': {
          return { ...state, status: 'recorded' };
        }
        default:
          return state;
      }
    }
  }
}

const Recorder = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const effect = useNotesEffect();
  const dispatchNote = useNotesDispatch();

  useEffect(() => {
    if (state.status !== 'recording' || !effect) return;

    const time = Transport.immediate() - state.startTime;
    dispatch({ type: 'ADD_NOTE_EFFECT', effect: { ...effect, time } });
  }, [effect, state.status, state.startTime]);

  function startRecording() {
    const startTime = Transport.immediate();
    dispatch({ type: 'START_RECORDING', startTime });
  }

  function stopRecording() {
    const duration = Transport.immediate() - state.startTime;
    dispatch({ type: 'STOP_RECORDING', duration });
  }

  function startPlayback() {
    dispatch({ type: 'START_PLAYBACK' });
    Transport.stop();
    Transport.cancel();

    state.recording.forEach((event) => {
      Transport.schedule(() => {
        switch (event.type) {
          case 'TRIGGER_ATTACK': {
            dispatchNote({ type: 'NOTE_ON', note: event.note, velocity: event.velocity }); // prettier-ignore
            break;
          }
          case 'TRIGGER_RELEASE': {
            dispatchNote({ type: 'NOTE_OFF', note: event.note });
          }
        }
      }, event.time);
    });

    Transport.schedule(() => {
      dispatch({ type: 'STOP_PLAYBACK' });
    }, state.duration);

    Transport.start();
  }

  function stopPlayback() {
    Transport.stop();
    Transport.cancel();
    dispatch({ type: 'STOP_PLAYBACK' });
    // TODO: dispatch release of all active notes
  }

  return (
    <div className="flex flex-row text-3xl text-gray-900">
      {state.status === 'idle' && (
        <button onClick={startRecording} className="p-1 rounded-full">
          <Record aria-label="Start recording" />
        </button>
      )}

      {state.status === 'recording' && (
        <button onClick={stopRecording} className="relative p-1 rounded-full">
          <Record
            className="motion-safe:animate-pulse"
            aria-label="Stop recording"
          />
          <div className="p-0.5 rounded-full bg-gray-900 absolute -bottom-1 left-1/2 transform -translate-x-1/2" />
        </button>
      )}

      {(state.status === 'recorded' || state.status === 'playback') && (
        <button
          onClick={() => dispatch({ type: 'SCRAP_RECORDING' })}
          className="p-1 rounded-full mr-4 disabled:text-gray-500 disabled:cursor-default"
          disabled={state.status === 'playback'}
        >
          <Cross aria-label="Scrap recording" />
        </button>
      )}

      {state.status === 'recorded' && (
        <button onClick={startPlayback} className="p-1 rounded-full">
          <Play aria-label="Play recording" />
        </button>
      )}

      {state.status === 'playback' && (
        <button
          onClick={stopPlayback}
          className="p-1 rounded-full"
          disabled={true}
        >
          <Stop aria-label="Stop playing recording" />
        </button>
      )}
    </div>
  );
};

export default Recorder;
