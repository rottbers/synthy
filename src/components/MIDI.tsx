import { useEffect } from 'react';
import { useNotesDispatch } from '../contexts/Notes';

const MIDI = () => {
  const dispatchNote = useNotesDispatch();

  useEffect(() => {
    function onMidiMessage(message: WebMidi.MIDIMessageEvent) {
      if (message.data.length <= 2) return;

      const [type, note, velocity] = message.data;

      switch (type) {
        case 144: {
          dispatchNote({ type: 'NOTE_ON', note, velocity });
          break;
        }
        case 128: {
          dispatchNote({ type: 'NOTE_OFF', note });
        }
      }
    }

    function onStateChange({ port }: WebMidi.MIDIConnectionEvent) {
      if (port.type !== 'input' && !('onmidimessage' in port)) return;
      //@ts-expect-error @types/webmidi seems to be missing types
      port.onmidimessage = onMidiMessage;
    }

    async function requestMidiAccess() {
      if (!window.navigator.requestMIDIAccess) return;

      try {
        const access = await window.navigator.requestMIDIAccess({ sysex: false }); // prettier-ignore

        access.onstatechange = onStateChange;

        const inputs = access.inputs.values();
        for (const input of inputs) input.onmidimessage = onMidiMessage;
      } catch (error) {
        // ...
      }
    }

    requestMidiAccess();
  }, [dispatchNote]);

  return null;
};

export default MIDI;
