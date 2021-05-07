import { useEffect } from 'react';
import { start } from 'tone';
import { useNotesDispatch } from '../contexts/Notes';
import { useAppDispatch, useAppState } from '../contexts/App';
import { calcNoteOctaveOffset } from '../shared/utils';

const keyboardNotes = {
  a: 60, // C4
  w: 61, // C#4
  s: 62, // D4
  e: 63, // D#4
  d: 64, // E4
  f: 65, // F4
  t: 66, // F#4
  g: 67, // G4
  y: 68, // G#4
  h: 69, // A4
  u: 70, // A#4
  j: 71, // B4
  k: 72, // C5
  o: 73, // C#5
  l: 74, // D5
};

const keyboardControls = {
  z: 'DECREMENT_OCTAVE',
  x: 'INCREMENT_OCTAVE',
  c: 'DECREMENT_VELOCITY',
  v: 'INCREMENT_VELOCITY',
};

const Keyboard = () => {
  const { octave, velocity, audioStarted } = useAppState();
  const dispatchApp = useAppDispatch();
  const dispatchNote = useNotesDispatch();

  useEffect(() => {
    async function onKeydown(e: KeyboardEvent) {
      if (e.repeat || e.ctrlKey || e.shiftKey || e.altKey) return;

      if (!audioStarted) {
        await start();
        dispatchApp({ type: 'AUDIO_STARTED' });
      }

      const key = e.key.toLowerCase();

      //@ts-expect-error TODO
      if (keyboardNotes[key]) {
        //@ts-expect-error TODO
        const note = calcNoteOctaveOffset(keyboardNotes[key], octave);
        dispatchNote({ type: 'NOTE_ON', note, velocity });
        return;
      }

      //@ts-expect-error TODO
      if (keyboardControls[key]) {
        //@ts-expect-error TODO
        const type = keyboardControls[key];
        dispatchApp({ type });
      }
    }

    function onKeyup(e: KeyboardEvent) {
      const key = e.key.toLowerCase();

      //@ts-expect-error TODO
      if (keyboardNotes[key]) {
        //@ts-expect-error TODO
        const note = calcNoteOctaveOffset(keyboardNotes[key], octave);
        dispatchNote({ type: 'NOTE_OFF', note });
      }
    }

    document.addEventListener('keydown', onKeydown);
    document.addEventListener('keyup', onKeyup);

    return () => {
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('keyup', onKeyup);
    };
  }, [octave, velocity, audioStarted, dispatchApp, dispatchNote]);

  return null;
};

export default Keyboard;
