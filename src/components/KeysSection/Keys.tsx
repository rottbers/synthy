import React, { useMemo } from 'react';
import { Frequency } from 'tone';
import { useNotesDispatch, useNotesState } from '../../contexts/Notes';
import { useSettingsState } from '../../contexts/Settings';
import { calcNoteOctaveOffset } from '../../utils';

const Keys = () => {
  const { octave } = useSettingsState();

  const totalKeys = 15;
  const neutralKeys = 9;

  return useMemo(
    () => (
      <div className="w-full h-full min-h-[120px] flex flex-row">
        {Array.from({ length: totalKeys }).map((_, index) => {
          const note = calcNoteOctaveOffset(60 + index, octave);
          const notation = Frequency(note, 'midi').toNote().slice(0, -1);
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
  const { [note]: noteState } = useNotesState();
  const notesDispatch = useNotesDispatch();

  return useMemo(() => {
    function onKeydown() {
      notesDispatch({ type: 'NOTE_ON', note, velocity: 100 });
    }

    function onKeyup() {
      notesDispatch({ type: 'NOTE_OFF', note });
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
                isActive ? 'bg-green-300' : 'bg-gray-700'
              } h-1/2 border-4 border-t-0 border-gray-700 rounded-b-sm`
            : `z-10 ${
                isActive ? 'bg-green-300' : 'bg-white'
              } h-full border-l-2 border-r-2 first:border-l-0 last:border-r-0 border-b-4 border-gray-700`
        } select-none cursor-pointer`}
      />
    );
  }, [note, isAccidental, width, marginLeft, noteState, notesDispatch]);
};
