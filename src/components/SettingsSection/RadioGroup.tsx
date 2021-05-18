import { createContext, useContext } from 'react';

interface RadioGroupProps {
  name: string;
  selectedOption: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioContext = createContext({
  name: '',
  selectedOption: '',
});

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  selectedOption,
  onChange,
  children,
}) => (
  <div onChange={onChange} className="w-min flex flex-row rounded-sm">
    <RadioContext.Provider value={{ name, selectedOption }}>
      {children}
    </RadioContext.Provider>
  </div>
);

const RadioOption: React.FC<{ value: string }> = ({ value, children }) => {
  const { name, selectedOption } = useContext(RadioContext);

  const isSelected = value === selectedOption;
  const id = `${name}-${value}`;

  return (
    <>
      <input
        type="radio"
        name={name}
        id={id}
        value={value}
        defaultChecked={isSelected}
        className="sr-only radio"
      />
      <label
        htmlFor={id}
        className={`relative p-1 select-none cursor-pointer first:rounded-l-sm last:rounded-r-sm ${
          isSelected
            ? 'text-white bg-gray-700 hover:cursor-default'
            : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
        }`}
      >
        {isSelected && (
          <div className="p-0.5 bg-white rounded-full absolute bottom-1 left-1/2 transform -translate-x-1/2" />
        )}

        {children}
      </label>
    </>
  );
};

export { RadioGroup, RadioOption };
