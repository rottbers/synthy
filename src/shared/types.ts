export type Waveform = 'sine' | 'sawtooth' | 'square' | 'triangle';
export type Envelope = { attack: number; decay: number; sustain: number; release: number }; // prettier-ignore
export type Filter = { type: 'lowpass' | 'highpass' | 'bandpass'; frequency: number }; // prettier-ignore
export type Reverb = { wet: number; decay: number };

export interface Settings {
  waveform: Waveform;
  envelope: Envelope;
  filter: Filter;
  reverb: Reverb;
}

export type Note =
  | { type: 'NOTE_ON'; note: number; velocity: number; time: number }
  | { type: 'NOTE_OFF'; note: number; time: number };

export type Notes = Note[];

export interface RecordingShareBody {
  notes: Notes;
  duration: number;
  settings: Settings;
}

export interface Recording extends RecordingShareBody {
  date: string;
  country: string;
}
