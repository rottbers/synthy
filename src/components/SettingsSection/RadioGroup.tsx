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

  return (
    <label
      className={`relative text-sm select-none font-semibold cursor-pointer p-1 first:rounded-l-sm last:rounded-r-sm ${
        isSelected
          ? 'text-white bg-gray-700'
          : 'text-gray-700 bg-gray-200 hover:bg-gray-300 focus:bg-gray-300'
      }`}
    >
      {isSelected && (
        <div className="p-px rounded-full bg-white absolute bottom-1 left-1/2 transform -translate-x-1/2" />
      )}
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={isSelected}
        className="sr-only"
      />
      {children}
    </label>
  );
};

export { RadioGroup, RadioOption };
