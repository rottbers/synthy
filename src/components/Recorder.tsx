import { useEffect, useReducer, useRef, useState } from 'react';
import { start, Transport } from 'tone';
import { useNotesDispatch, useNotesEvent } from '../contexts/Notes';
import { useSettingsState } from '../contexts/Settings';
import { useAppState, useAppDispatch } from '../contexts/App';

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

type Action =
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

function reducer(state: State, action: Action): State {
  switch (state.status) {
    case 'idle': {
      switch (action.type) {
        case 'START_RECORDING': {
          const startTime = action.startTime;
          return { ...state, startTime, notes: [], status: 'recording' };
        }
        default:
          return state;
      }
    }
    case 'recording': {
      switch (action.type) {
        case 'STOP_RECORDING': {
          const duration = action.duration;
          return state.notes.length
            ? { ...state, duration, status: 'recorded' }
            : { ...state, status: 'idle' };
        }
        case 'ADD_NOTE': {
          const notes = [...state.notes, action.note];
          return { ...state, notes };
        }
        default:
          return state;
      }
    }
    case 'recorded': {
      switch (action.type) {
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
      switch (action.type) {
        case 'STOP_PLAYBACK': {
          return { ...state, status: 'recorded' };
        }
        default:
          return state;
      }
    }
    case 'share-loading': {
      switch (action.type) {
        case 'SHARE_SUCCESS': {
          const recordingId = action.recordingId;
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
      switch (action.type) {
        case 'CLOSE_SHARE': {
          return { ...state, status: 'recorded' };
        }
        default:
          return state;
      }
    }
    case 'share-error': {
      switch (action.type) {
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
  const [state, dispatchRecorder] = useReducer(reducer, initialState);
  const { audioStarted } = useAppState();
  const dispatchApp = useAppDispatch();
  const noteEvent = useNotesEvent();
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
    if (!isRecording || !noteEvent || noteEvent.type === 'NOTES_OFF') return;

    const time = Transport.immediate() - state.startTime;
    dispatchRecorder({ type: 'ADD_NOTE', note: { ...noteEvent, time } });
  }, [noteEvent, isRecording, state.startTime]);

  async function startRecording() {
    if (!audioStarted) {
      await start();
      dispatchApp({ type: 'AUDIO_STARTED' });
    }
    const startTime = Transport.immediate();
    dispatchRecorder({ type: 'START_RECORDING', startTime });
  }

  function stopRecording() {
    const duration = Transport.immediate() - state.startTime;
    dispatchRecorder({ type: 'STOP_RECORDING', duration });
  }

  function stopPlayback() {
    Transport.stop();
    Transport.cancel();
    dispatchRecorder({ type: 'STOP_PLAYBACK' });
    dispatchNote({ type: 'NOTES_OFF' });
  }

  function startPlayback() {
    dispatchRecorder({ type: 'START_PLAYBACK' });
    Transport.stop();
    Transport.cancel();

    state.notes.forEach(({ time, ...event }) => {
      Transport.schedule(() => {
        dispatchNote({ ...event });
      }, time);
    });

    Transport.schedule(() => {
      stopPlayback();
    }, state.duration);

    Transport.start();
  }

  async function shareRecording() {
    if (state.recordingId) {
      dispatchRecorder({ type: 'SHOW_SHARE' });
      return;
    }

    dispatchRecorder({ type: 'SHARE_LOADING' });

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

      dispatchRecorder({ type: 'SHARE_SUCCESS', recordingId });
    } catch {
      dispatchRecorder({ type: 'SHARE_ERROR' });
    }
  }

  return (
    <>
      <div className="flex flex-row text-2xl text-gray-900 -mr-1.5">
        {(isRecorded || isPlayback || isShareSuccess || isShareError) && (
          <button
            onClick={shareRecording}
            className="p-3 bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-inset ring-blue-400 focus:outline-none disabled:text-gray-600 disabled:hover:bg-gray-200 disabled:cursor-default"
            disabled={isPlayback || isShareSuccess || isShareError}
          >
            <Share aria-label="Share recording" />
          </button>
        )}

        {isShareLoading && (
          <div className="p-3 flex items-center">
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

        {!isIdle && !isRecording && (
          <button
            onClick={() => dispatchRecorder({ type: 'SCRAP_RECORDING' })}
            className="p-3 bg-gray-200 hover:bg-gray-300 focus-visible:ring ring-inset ring-blue-400 focus:outline-none disabled:text-gray-600 disabled:hover:bg-gray-200 disabled:cursor-default"
            disabled={isPlayback || isShareLoading}
          >
            <Cross aria-label="Scrap recording" />
          </button>
        )}

        <button
          onClick={() => {
            if (isIdle) startRecording();
            if (isRecording) stopRecording();
            if (isRecorded) startPlayback();
            if (isPlayback) stopPlayback();
          }}
          className="relative p-3 bg-amber-200 hover:bg-amber-200 focus-visible:ring ring-inset ring-blue-400 focus:outline-none disabled:text-gray-600 disabled:hover:bg-gray-200 disabled:cursor-default"
          disabled={isShareLoading}
        >
          {isIdle && <Record aria-label="Start recording" />}

          {isRecording && (
            <>
              <Record
                className="motion-safe:animate-pulse"
                aria-label="Stop recording"
              />
              <div className="p-0.5 rounded-full bg-gray-900 absolute bottom-1 left-1/2 transform -translate-x-1/2" />
            </>
          )}

          {(isRecorded ||
            isShareLoading ||
            isShareSuccess ||
            isShareSuccess) && (
            <Play
              aria-label="Play recording"
              className="transform translate-x-[5%]"
            />
          )}

          {isPlayback && <Stop aria-label="Stop playing recording" />}
        </button>
      </div>

      {isShareSuccess && state.recordingId && (
        <ShareDialog
          url={window.location.href + state.recordingId}
          onClose={() => dispatchRecorder({ type: 'CLOSE_SHARE' })}
        />
      )}

      {isShareError && (
        <ShareDialog
          error="Something went wrong"
          onClose={() => dispatchRecorder({ type: 'CLOSE_SHARE' })}
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
            className="p-4 hover:bg-gray-200 focus-visible:bg-gray-900 focus-visible:text-white focus:outline-none"
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
                className="min-w-[8rem] font-semibold bg-gray-900 text-white py-2 px-8 rounded-sm self-center hover:bg-gray-700 focus-visible:bg-gray-700 active:bg-gray-700 focus:outline-none"
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
