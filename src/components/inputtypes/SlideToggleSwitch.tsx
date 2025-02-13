import { ChangeEvent } from "react";

const SlideToggleSwitch = ({
  name,
  isChecked,
  isDisabled,
  onCheckboxChange,
}: {
  name?: string;
  isChecked: boolean;
  isDisabled: boolean;
  onCheckboxChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  // const [isChecked, setIsChecked] = useState(false);

  // const handleCheckboxChange = () => {
  //   setIsChecked(!isChecked);
  // };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={isChecked}
          disabled={isDisabled}
          onChange={(e) => onCheckboxChange(e)}
          className="sr-only"
        />
        <div
          className={`box block h-6 w-10 rounded-full ${
            isChecked ? "bg-midnight" : "bg-slate-200"
          }`}
        ></div>
        <div
          className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
            isChecked ? "translate-x-full" : ""
          }`}
        ></div>
      </div>
    </label>
  );
};

export default SlideToggleSwitch;
