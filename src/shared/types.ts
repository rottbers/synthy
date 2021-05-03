export type Octave = number; // 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type Velocity = 1 | 20 | 40 | 60 | 80 | 100 | 127;
export type Waveform = 'sine' | 'sawtooth' | 'square' | 'triangle';
export type Envelope = { attack: number; decay: number; sustain: number; release: number }; // prettier-ignore
export type Filter = { type: 'lowpass' | 'highpass' | 'bandpass'; frequency: number }; // prettier-ignore
export type Reverb = { wet: number; decay: number };

export interface Settings {
  octave: Octave;
  velocity: Velocity;
  waveform: Waveform;
  envelope: Envelope;
  filter: Filter;
  reverb: Reverb;
}

export type Note =
  | { type: 'TRIGGER_ATTACK'; note: number; velocity: number; time: number }
  | { type: 'TRIGGER_RELEASE'; note: number; time: number };

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
