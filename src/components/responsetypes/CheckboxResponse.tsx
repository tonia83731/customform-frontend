import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";

const CheckboxResponse = ({
  id,
  options,
  response,
  isRequired,
  hasLimit,
  maxSelectLimit,
}: {
  id: string;
  options: string[];
  response: string[];
  isRequired: boolean;
  hasLimit: boolean;
  maxSelectLimit: number | null;
}) => {
  const dispatch = useDispatch();
  const handleAnswerChange = (
    e: ChangeEvent<HTMLInputElement>,
    opt: string
  ) => {
    const { value } = e.target;
    dispatch(
      updatedQuestionError({
        id,
        isError: false,
        errMessage: "",
      })
    );
    let isEmpty;
    if (response.includes(value)) {
      const updatedOpts = response.filter((item) => item !== opt);
      isEmpty = updatedOpts.length === 0;
      dispatch(
        addQuestionResponse({
          id,
          response: updatedOpts,
        })
      );
    } else {
      const updatedOpts = [...response, value];
      isEmpty = updatedOpts.length === 0;
      dispatch(
        addQuestionResponse({
          id,
          response: updatedOpts,
        })
      );
    }

    if (isRequired && isEmpty) {
      dispatch(
        updatedQuestionError({
          id,
          isError: true,
          errMessage: "This field is required!",
        })
      );
    }
  };
  const handleAnswerClear = () => {
    dispatch(
      addQuestionResponse({
        id,
        response: [],
      })
    );

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
        {options.map((opt, index) => {
          return (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`checkbox-${id}-${index}`}
                value={opt}
                checked={response.includes(opt)}
                disabled={
                  !!(
                    hasLimit &&
                    maxSelectLimit &&
                    response.length >= maxSelectLimit &&
                    !response.includes(opt)
                  )
                }
                onChange={(e) => handleAnswerChange(e, opt)}
                className="accent-midnight cursor-pointer"
              />
              <label
                htmlFor={`checkbox-${id}-${index}`}
                className="cursor-pointer"
              >
                {opt}
              </label>
            </div>
          );
        })}
        {hasLimit && maxSelectLimit && (
          <p className="flex justify-end text-slate-400 text-sm">
            {response.length} of {maxSelectLimit}
          </p>
        )}
      </div>
      {response.length > 0 && (
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

export default CheckboxResponse;
