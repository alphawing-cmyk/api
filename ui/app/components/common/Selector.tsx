function Selector({
    label,
    options,
    handleSelected,
  }: {
    label: string | null;
    options: Array<{
      id: number;
      option: string;
      value: string;
      default: boolean;
    }>;
    handleSelected: (val: string) => void;
  }) {
    const defaultValue = options?.filter((option) => {
      return option.default;
    })[0].value;
  
    return (
      <div>
        <label className="block mb-2 text-sm font-semibold text-neutral-700">
          {label}
        </label>
        <select
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500
                     block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                     dark:focus:ring-blue-500 dark:focus:border-blue-500 appearance-none"
          defaultValue={defaultValue}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            handleSelected(e.target.value);
          }}
        >
          <option disabled>Choose an option</option>
          {options.map(
            (option: {
              id: number;
              option: string;
              value: string;
              default: boolean;
            }) => {
              return (
                <option value={option.value} key={option.id}>
                  {option.option}
                </option>
              );
            },
          )}
        </select>
      </div>
    );
  }
  
  export default Selector;
  