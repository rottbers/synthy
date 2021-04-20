import { useEffect } from 'react';
import { useNotesDispatch } from '../contexts/Notes';

const MIDI = () => {
  const dispatchNote = useNotesDispatch();

  useEffect(() => {
    function onMessage(message: WebMidi.MIDIMessageEvent) {
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

    function onStateChange(e: WebMidi.MIDIConnectionEvent) {
      // eslint-disable-next-line no-console
      console.log(e); // TODO
    }

    async function requestMIDI() {
      if (!window.navigator.requestMIDIAccess) return;

      try {
        const access = await window.navigator.requestMIDIAccess();

        access.onstatechange = onStateChange;

        const inputs = access.inputs.values();
        for (const input of inputs) input.onmidimessage = onMessage;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    }

    requestMIDI();
  }, [dispatchNote]);

  return null;
};

export default MIDI;
