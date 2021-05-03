import React, { useEffect, useReducer, useRef, useState } from 'react';
import { Transport } from 'tone';
import { useNotesDispatch, useNotesEffect } from '../contexts/Notes';
import { useSettingsState } from '../contexts/Settings';

import Record from '../icons/Record';
import Play from '../icons/Play';
import Stop from '../icons/Stop';
import Cross from '../icons/Cross';
import Share from '../icons/Share';

import { Note, Notes, RecordingShareBody } from '../shared/types';

interface State {
  status: 'idle' | 'recording' | 'recorded' | 'playback' | 'share-loading' | 'share-success' | 'share-error'; // prettier-ignore
  notes: Notes;
  startTime: number;
  duration: number;
  recordingId: string | null;
}

type Event =
  | { type: 'SCRAP_RECORDING' | 'START_PLAYBACK' | 'STOP_PLAYBACK' | 'SHARE_LOADING' | 'SHARE_ERROR' | 'SHOW_SHARE' | 'CLOSE_SHARE'; } // prettier-ignore
  | { type: 'SHARE_SUCCESS'; recordingId: string }
  | { type: 'START_RECORDING'; startTime: number }
  | { type: 'STOP_RECORDING'; duration: number }
  | { type: 'ADD_NOTE'; note: Note };

const initialState: State = {
  status: 'idle',
  notes: [],
  startTime: 0,
  duration: 0,
  recordingId: null,
};

function reducer(state: State, event: Event): State {
  switch (state.status) {
    case 'idle': {
      switch (event.type) {
        case 'START_RECORDING': {
          const startTime = event.startTime;
          return { ...state, startTime, notes: [], status: 'recording' };
        }
        default:
          return state;
      }
    }
    case 'recording': {
      switch (event.type) {
        case 'STOP_RECORDING': {
          const duration = event.duration;
          return state.notes.length
            ? { ...state, duration, status: 'recorded' }
            : { ...state, status: 'idle' };
        }
        case 'ADD_NOTE': {
          const notes = [...state.notes, event.note];
          return { ...state, notes };
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
        case 'SHARE_LOADING': {
          return { ...state, status: 'share-loading' };
        }
        case 'SHOW_SHARE': {
          return state.recordingId
            ? { ...state, status: 'share-success' }
            : state;
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
    case 'share-loading': {
      switch (event.type) {
        case 'SHARE_SUCCESS': {
          const recordingId = event.recordingId;
          return { ...state, recordingId, status: 'share-success' };
        }
        case 'SHARE_ERROR': {
          return { ...state, status: 'share-error' };
        }
        default:
          return state;
      }
    }
    case 'share-success': {
      switch (event.type) {
        case 'CLOSE_SHARE': {
          return { ...state, status: 'recorded' };
        }
        default:
          return state;
      }
    }
    case 'share-error': {
      switch (event.type) {
        case 'CLOSE_SHARE': {
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
  const noteEffect = useNotesEffect();
  const dispatchNote = useNotesDispatch();
  const settings = useSettingsState();

  const isIdle = state.status === 'idle';
  const isRecording = state.status === 'recording';
  const isRecorded = state.status === 'recorded';
  const isPlayback = state.status === 'playback';
  const isShareLoading = state.status === 'share-loading';
  const isShareSuccess = state.status === 'share-success';
  const isShareError = state.status === 'share-error';

  useEffect(() => {
    if (!isRecording || !noteEffect) return;

    const time = Transport.immediate() - state.startTime;
    dispatch({ type: 'ADD_NOTE', note: { ...noteEffect, time } });
  }, [noteEffect, isRecording, state.startTime]);

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

    state.notes.forEach((event) => {
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

  async function shareRecording() {
    if (state.recordingId) {
      dispatch({ type: 'SHOW_SHARE' });
      return;
    }

    dispatch({ type: 'SHARE_LOADING' });

    const data: RecordingShareBody = {
      notes: state.notes,
      duration: state.duration,
      settings,
    };

    try {
      const body = JSON.stringify(data);
      const options = { method: 'POST', body };

      const response = await fetch('/api/recording/share', options);
      if (!response.ok) throw new Error();

      const { recordingId } = await response.json();

      dispatch({ type: 'SHARE_SUCCESS', recordingId });
    } catch {
      dispatch({ type: 'SHARE_ERROR' });
    }
  }

  return (
    <>
      <div className="flex flex-row text-2xl text-gray-900 -mr-1">
        {isIdle && (
          <button
            onClick={startRecording}
            className="p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
          >
            <Record aria-label="Start recording" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none relative "
          >
            <Record
              className="motion-safe:animate-pulse"
              aria-label="Stop recording"
            />
            <div className="p-0.5 rounded-full bg-gray-900 absolute bottom-0 left-1/2 transform -translate-x-1/2" />
          </button>
        )}

        {(isRecorded || isPlayback || isShareSuccess || isShareError) && (
          <button
            onClick={shareRecording}
            className="mr-2 p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:text-gray-600 disabled:cursor-default"
            disabled={isPlayback || isShareSuccess || isShareError}
          >
            <Share aria-label="Share recording" />
          </button>
        )}

        {isShareLoading && (
          <div className="mr-2 p-2 flex items-center">
            <svg
              className="animate-spin text-gray-900"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              width="1em"
            >
              <circle
                className="stroke-current"
                fill="transparent"
                strokeWidth="4"
                strokeDasharray="88"
                strokeDashoffset="22"
                cx="16"
                cy="16"
                r="14"
              />
            </svg>
          </div>
        )}

        {(isRecorded ||
          isPlayback ||
          isShareLoading ||
          isShareSuccess ||
          isShareError) && (
          <button
            onClick={() => dispatch({ type: 'SCRAP_RECORDING' })}
            className="mr-2 p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:text-gray-600 disabled:cursor-default"
            disabled={isPlayback || isShareLoading}
          >
            <Cross aria-label="Scrap recording" />
          </button>
        )}

        {(isRecorded || isShareLoading || isShareSuccess || isShareError) && (
          <button
            onClick={startPlayback}
            className="p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none disabled:text-gray-600 disabled:cursor-default"
            disabled={isShareLoading}
          >
            <Play
              aria-label="Play recording"
              className="transform translate-x-[10%]"
            />
          </button>
        )}

        {isPlayback && (
          <button
            onClick={stopPlayback}
            className="p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            disabled={true}
          >
            <Stop aria-label="Stop playing recording" />
          </button>
        )}
      </div>

      {isShareSuccess && state.recordingId && (
        <ShareDialog
          url={window.location.href + state.recordingId}
          onClose={() => dispatch({ type: 'CLOSE_SHARE' })}
        />
      )}

      {isShareError && (
        <ShareDialog
          error="Something went wrong"
          onClose={() => dispatch({ type: 'CLOSE_SHARE' })}
        />
      )}
    </>
  );
};

export default Recorder;

interface ShareDialogProps {
  url?: string;
  error?: string;
  onClose: () => void;
}

const ShareDialog = ({ url, error, onClose }: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current !== null) buttonRef.current.focus();
  }, []);

  useEffect(() => {
    function close(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', close);

    return () => {
      document.removeEventListener('keydown', close);
    };
  }, [onClose]);

  async function copy() {
    if (!url || !navigator.clipboard) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="dialog-title"
      className="absolute top-0 left-0 z-50 h-screen w-full transition backdrop-filter backdrop-blur bg-gray-900 bg-opacity-50 flex items-center justify-center"
    >
      <div className="w-full sm:w-auto sm:min-w-[24rem] sm:px-8 p-4 rounded-sm shadow bg-white">
        <div className="flex flex-row justify-between items-center mb-4 text-gray-900">
          <h2 id="dialog-title" className="font-bold text-xl">
            Share
          </h2>
          <button
            ref={error ? buttonRef : null}
            className="p-2 rounded-full hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
            onClick={onClose}
          >
            <Cross aria-label="Close" />
          </button>
        </div>

        {error ? (
          <p className="text-gray-600 mb-6">{error}</p>
        ) : (
          <>
            <p className="text-gray-900 bg-gray-100 mb-6 rounded-sm p-2 overflow-x-hidden">
              {url}
            </p>
            <div className="flex flex-row justify-end">
              <button
                ref={buttonRef}
                onClick={copy}
                className="min-w-[8rem] font-semibold bg-gray-900 text-white py-2 px-8 rounded-sm self-center hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-700 focus:outline-none"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
