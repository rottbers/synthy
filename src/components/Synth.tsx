import { useEffect, useRef } from 'react';
import { PolySynth, Filter, Reverb, Destination } from 'tone';
import { useSettingsState } from '../contexts/Settings';
import { useNotesEffect } from '../contexts/Notes';
import { midiNoteToCharNote } from '../shared/utils';

const Synth = () => {
  const { reverb, filter, envelope, waveform } = useSettingsState();
  const noteEffect = useNotesEffect();

  const reverbRef = useRef<Reverb | null>(null);
  const filterRef = useRef<Filter | null>(null);
  const synthRef = useRef<PolySynth | null>(null);

  useEffect(() => {
    reverbRef.current = new Reverb();
    filterRef.current = new Filter();
    synthRef.current = new PolySynth({ volume: -12 }).chain(
      reverbRef.current,
      filterRef.current,
      Destination
    );
  }, []);

  useEffect(() => {
    if (reverbRef.current) reverbRef.current.set(reverb);
  }, [reverb]);

  useEffect(() => {
    if (filterRef.current) filterRef.current.set(filter);
  }, [filter]);

  useEffect(() => {
    if (synthRef.current)
      synthRef.current.set({ envelope, oscillator: { type: waveform } });
  }, [envelope, waveform]);

  useEffect(() => {
    if (!noteEffect || !synthRef.current) return;

    switch (noteEffect.type) {
      case 'NOTE_ON': {
        const note = midiNoteToCharNote(noteEffect.note);
        const velocity = Number((noteEffect.velocity / 127).toFixed(2));
        synthRef.current.triggerAttack(note, '+0.025', velocity);
        break;
      }
      case 'NOTE_OFF': {
        const note = midiNoteToCharNote(noteEffect.note);
        synthRef.current.triggerRelease(note, '+0.025');
        break;
      }
      case 'NOTES_OFF': {
        const notes = noteEffect.notes.map((note) => midiNoteToCharNote(note));
        synthRef.current.triggerRelease(notes, '+0.025');
      }
    }
  }, [noteEffect]);

  return null;
};

export default Synth;
