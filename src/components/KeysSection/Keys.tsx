import { useMemo } from 'react';
import { start } from 'tone';
import { useAppDispatch, useAppState } from '../../contexts/App';
import { useNotesDispatch, useNotesState } from '../../contexts/Notes';
import { calcNoteOctaveOffset, midiNoteToCharNote } from '../../shared/utils';

const Keys = () => {
  const { octave } = useAppState();

  const totalKeys = 15;
  const neutralKeys = 9;

  return useMemo(
    () => (
      <div className="w-full h-full min-h-[120px] flex flex-row">
        {Array.from({ length: totalKeys }).map((_, index) => {
          const note = calcNoteOctaveOffset(60 + index, octave);
          const notation = midiNoteToCharNote(note).slice(0, -1);
          const isAccidental = notation.includes('#');
          const isNeutralNextToNeutral = notation === 'C' || notation === 'F';

          const width = isAccidental ? 100 / neutralKeys / 1.5 : 100 / neutralKeys; // prettier-ignore
          const marginLeft = isNeutralNextToNeutral ? 0 : isAccidental ? -width / 2 : -width / 3; // prettier-ignore

          return (
            <Key
              key={note}
              note={note}
              isAccidental={isAccidental}
              width={width}
              marginLeft={marginLeft}
            />
          );
        })}
      </div>
    ),
    [octave]
  );
};

export default Keys;

interface KeyProps {
  note: number;
  isAccidental: boolean;
  width: number;
  marginLeft: number;
}

const Key: React.FC<KeyProps> = ({ note, isAccidental, width, marginLeft }) => {
  const { audioStarted } = useAppState();
  const dispatchApp = useAppDispatch();
  const { [note]: noteState } = useNotesState();
  const dispatchNote = useNotesDispatch();

  return useMemo(() => {
    async function onKeydown() {
      if (!audioStarted) {
        await start();
        dispatchApp({ type: 'AUDIO_STARTED' });
      }
      dispatchNote({ type: 'NOTE_ON', note, velocity: 100 });
    }

    function onKeyup() {
      dispatchNote({ type: 'NOTE_OFF', note });
    }

    const isActive = noteState === 'on';

    return (
      <div
        role="none"
        onTouchStart={onKeydown}
        onTouchEnd={onKeyup}
        onTouchCancel={onKeyup}
        onMouseDown={onKeydown}
        onMouseUp={onKeyup}
        onMouseLeave={onKeyup}
        style={{
          width: `${width}%`,
          marginLeft: `${marginLeft}%`,
          WebkitTapHighlightColor: 'transparent',
          touchAction: 'none',
        }}
        className={`${
          isAccidental
            ? `z-20 ${
                isActive ? 'bg-amber-200' : 'bg-gray-700'
              } h-1/2 border-4 border-t-0 border-gray-700 rounded-b-sm`
            : `z-10 ${
                isActive ? 'bg-amber-200' : 'bg-white'
              } h-full border-l-2 border-r-2 first:border-l-0 last:border-r-0 border-b-4 border-gray-700`
        } select-none cursor-pointer`}
      />
    );
  }, [
    note,
    isAccidental,
    width,
    marginLeft,
    audioStarted,
    noteState,
    dispatchApp,
    dispatchNote,
  ]);
};
