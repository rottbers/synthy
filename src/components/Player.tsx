import { useEffect, useReducer } from 'react';
import { Transport, start } from 'tone';
import { useNotesDispatch } from '../contexts/Notes';
import { useSettingsDispatch } from '../contexts/Settings';

import Play from '../icons/Play';
import Stop from '../icons/Stop';

import { Recording } from '../shared/types';

interface State {
  status: 'loading' | 'success' | 'error' | 'playing';
  recording: Recording | null;
  elapsed: number;
  startTime: number;
}

type Event =
  | { type: 'ERROR' | 'STOP' }
  | { type: 'SUCCESS'; recording: Recording }
  | { type: 'PLAY'; startTime: number }
  | { type: 'UPDATE_ELAPSED'; currentTime: number };

function reducer(state: State, event: Event): State {
  switch (state.status) {
    case 'loading': {
      switch (event.type) {
        case 'SUCCESS': {
          const recording = event.recording;
          return { ...state, recording, status: 'success' };
        }
        case 'ERROR': {
          return { ...state, status: 'error' };
        }
        default:
          return state;
      }
    }
    case 'success': {
      switch (event.type) {
        case 'PLAY': {
          const startTime = event.startTime;
          return { ...state, startTime, status: 'playing' };
        }
        default:
          return state;
      }
    }
    case 'playing': {
      switch (event.type) {
        case 'STOP': {
          return { ...state, elapsed: 0, status: 'success' };
        }
        case 'UPDATE_ELAPSED': {
          if (!state.recording) return { ...state };

          const current = event.currentTime - state.startTime;
          const duration = state.recording.duration;
          const percent = (current / duration) * 100;
          const elapsed = percent > 100 ? 100 : percent;
          return { ...state, elapsed };
        }
        default:
          return state;
      }
    }
    case 'error': {
      switch (event.type) {
        default:
          return state;
      }
    }
  }
}

const initialState: State = {
  status: 'loading',
  recording: null,
  startTime: 0,
  elapsed: 0,
};

const Player = ({ recordingId }: { recordingId: string | undefined }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const dispatchNote = useNotesDispatch();
  const dispatchSetting = useSettingsDispatch();

  const { recording, status } = state;

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isPlaying = status === 'playing';
  const isError = status === 'error';

  useEffect(() => {
    if (!recordingId) return;

    async function getRecording() {
      try {
        const response = await fetch(`/api/recording/${recordingId}`);
        if (!response.ok) throw new Error();

        const { data }: { data: Recording } = await response.json();
        const { waveform, envelope, filter, reverb } = data.settings;

        dispatchSetting({ type: 'UPDATE_WAVEFORM', waveform });
        dispatchSetting({ type: 'UPDATE_ENVELOPE', envelope });
        dispatchSetting({ type: 'UPDATE_FILTER', filter });
        dispatchSetting({ type: 'UPDATE_REVERB', reverb });

        dispatch({ type: 'SUCCESS', recording: data });
      } catch (error) {
        dispatch({ type: 'ERROR' });
      }
    }

    getRecording();
  }, [recordingId, dispatchSetting]);

  function stop() {
    Transport.stop();
    Transport.cancel();
    dispatch({ type: 'STOP' });
    // TODO: dispatch release of all active notes
  }

  async function play() {
    if (!recording || !isSuccess) return;

    await start();

    const startTime = Transport.immediate();
    dispatch({ type: 'PLAY', startTime });

    recording.notes.forEach((event) => {
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

    Transport.scheduleRepeat((currentTime) => {
      dispatch({ type: 'UPDATE_ELAPSED', currentTime });
    }, 0.1);

    Transport.schedule(() => {
      stop();
    }, recording.duration + 0.2);

    Transport.start();
  }

  const date = recording?.date ? new Date(recording?.date).toLocaleDateString() : ''; // prettier-ignore
  const country = recording?.country ? recording.country : 'Sweden';

  return (
    <section className="flex flex-col items-center justify-center px-4 pt-4 pb-6">
      <h2 className="sr-only">Listen</h2>
      <button
        disabled={isLoading || isError}
        className={`p-8 rounded-full border-4 border-gray-900 focus:outline-none disabled:cursor-default disabled:text-gray-500 disabled:border-gray-500 relative ${
          isLoading ? 'animate-pulse' : ''
        }`}
        onClick={isPlaying ? stop : play}
      >
        {isPlaying ? (
          <>
            <svg
              className="absolute top-0 left-0 w-full h-full transform -rotate-90"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <circle
                cx="16"
                cy="16"
                r="14"
                strokeWidth="1.8"
                strokeDasharray="88 88"
                fill="transparent"
                className="stroke-current text-gray-200"
              />
              <circle
                cx="16"
                cy="16"
                r="14"
                strokeWidth="2"
                strokeDasharray="88 88"
                strokeDashoffset={88 - (state.elapsed / 100) * 88}
                fill="transparent"
                className="stroke-current text-gray-600 transition-all ease-linear"
              />
            </svg>

            <Stop className="text-3xl" aria-label="Stop" />
          </>
        ) : (
          <Play
            className="text-3xl transform translate-x-[10%]"
            aria-label="Play"
          />
        )}
      </button>

      <div className="w-max text-text-xs sm:text-sm text-center mt-4">
        {isLoading && (
          <p className="bg-gray-200 text-gray-200 w-72 animate-pulse">
            Loading...
          </p>
        )}
        {(isSuccess || isPlaying) && (
          <p className="text-gray-600">
            Recorded on {date}
            {country && ` in ${country}`}
          </p>
        )}
        {isError && (
          <p className="text-gray-600">
            Something went wrong getting the recording :/
          </p>
        )}
      </div>
    </section>
  );
};

export default Player;
