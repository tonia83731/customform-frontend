import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";
import { ChangeEvent } from "react";

const LinearScaleResponse = ({
  id,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  response,
  isRequired,
}: {
  id: string;
  minValue: number;
  maxValue: number;
  minLabel?: string;
  maxLabel?: string;
  response: number | null;
  isRequired: boolean;
}) => {
  const dispatch = useDispatch();
  const range = Array.from(
    { length: maxValue - minValue + 1 },
    (_, i) => minValue + i
  );

  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const num = Number(value);
    dispatch(
      updatedQuestionError({
        id,
        isError: false,
        errMessage: "",
      })
    );
    dispatch(
      addQuestionResponse({
        id,
        response: num,
      })
    );
  };
  const handleAnswerClear = () => {
    dispatch(addQuestionResponse({ id, response: null }));
    if (isRequired) {
      dispatch(
        updatedQuestionError({
          id,
          isError: true,
          errMessage: "This field is required!",
        })
      );
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end gap-4">
        <h5 className="text-xs md:text-sm text-center">{minLabel}</h5>

        <div className="w-3/5 max-w-[750px] flex justify-between items-center gap-0.5">
          {range.map((num) => (
            <div
              className="flex flex-col items-center justify-center"
              key={`${id}-range-${num}`}
            >
              <label htmlFor={`${id}-range-${num}`} className="font-medium">
                {num}
              </label>
              <input
                type="radio"
                id={`${id}-range-${num}`}
                name={id}
                value={num}
                checked={response === num}
                onChange={handleAnswerChange}
                className="accent-midnight cursor-pointer"
              />
            </div>
          ))}
        </div>

        <h5 className="text-xs md:text-sm text-center">{maxLabel}</h5>
      </div>
      {response && (
        <div className="flex justify-end">
          <button
            onClick={handleAnswerClear}
            className="text-slate-400 text-xs md:text-sm cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}
    </div>
  );
};

export default LinearScaleResponse;
