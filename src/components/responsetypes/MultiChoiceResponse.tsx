import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";

const MultiChoiceResponse = ({
  id,
  options,
  response,
  isRequired,
}: {
  id: string;
  options: string[];
  response: string | null;
  isRequired: boolean;
}) => {
  const dispatch = useDispatch();
  const handleRadioChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      updatedQuestionError({
        id,
        isError: false,
        errMessage: "",
      })
    );
    dispatch(addQuestionResponse({ id, response: e.target.value }));
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
    <>
      <div className="flex flex-col gap-1">
        <>
          {options.map((opt, index) => {
            return (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`radio-${id}-${index}`}
                  value={opt}
                  name={id}
                  checked={response === opt}
                  onChange={handleRadioChange}
                  className="accent-midnight cursor-pointer"
                />
                <label
                  htmlFor={`radio-${id}-${index}`}
                  className="cursor-pointer"
                >
                  {opt}
                </label>
              </div>
            );
          })}
        </>
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
    </>
  );
};

export default MultiChoiceResponse;
