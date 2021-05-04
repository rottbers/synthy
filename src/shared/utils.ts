import { Frequency } from 'tone';

export function calcNoteOctaveOffset(note: number, octave: number) {
  const baseOctave = 4;
  const notesInOctave = 12;
  return (octave - baseOctave) * notesInOctave + note;
}

export function midiNoteToCharNote(note: number) {
  return Frequency(note, 'midi').toNote();
}
