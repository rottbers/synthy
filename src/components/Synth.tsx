import { useEffect, useRef } from 'react';
import { PolySynth, Filter, Reverb, Destination } from 'tone';
import { useAppState } from '../contexts/App';
import { useSettingsState } from '../contexts/Settings';
import { useNotesEvent } from '../contexts/Notes';
import { midiNoteToCharNote } from '../shared/utils';

const Synth = () => {
  const { audioStarted } = useAppState();
  const { reverb, filter, envelope, waveform } = useSettingsState();
  const noteEvent = useNotesEvent();

  const reverbRef = useRef<Reverb | null>(null);
  const filterRef = useRef<Filter | null>(null);
  const synthRef = useRef<PolySynth | null>(null);

  useEffect(() => {
    if (!audioStarted) return;

    reverbRef.current = new Reverb();
    filterRef.current = new Filter();
    synthRef.current = new PolySynth({ volume: -12 }).chain(
      reverbRef.current,
      filterRef.current,
      Destination
    );
  }, [audioStarted]);

  useEffect(() => {
    if (reverbRef.current && audioStarted) reverbRef.current.set(reverb);
  }, [reverb, audioStarted]);

  useEffect(() => {
    if (filterRef.current && audioStarted) filterRef.current.set(filter);
  }, [filter, audioStarted]);

  useEffect(() => {
    if (synthRef.current && audioStarted)
      synthRef.current.set({ envelope, oscillator: { type: waveform } });
  }, [envelope, waveform, audioStarted]);

  useEffect(() => {
    if (!noteEvent || !synthRef.current) return;

    switch (noteEvent.type) {
      case 'NOTE_ON': {
        const note = midiNoteToCharNote(noteEvent.note);
        const velocity = Number((noteEvent.velocity / 127).toFixed(2));
        synthRef.current.triggerAttack(note, '+0.025', velocity);
        break;
      }
      case 'NOTE_OFF': {
        const note = midiNoteToCharNote(noteEvent.note);
        synthRef.current.triggerRelease(note, '+0.025');
        break;
      }
      case 'NOTES_OFF': {
        const notes = noteEvent.notes.map((note) => midiNoteToCharNote(note));
        synthRef.current.triggerRelease(notes, '+0.025');
      }
    }
  }, [noteEvent]);

  return null;
};

export default Synth;
