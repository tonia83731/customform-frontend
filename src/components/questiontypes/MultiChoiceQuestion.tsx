import { ChangeEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { DefaultQuestonProps } from "./ShortQuestion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {
  addQuestionOptions,
  deleteQuestionOptions,
  updatedQuestion,
  updatedQuestionOptionsText,
} from "../../state/form/formSlice";

export type OptionQuestionProps = DefaultQuestonProps & {
  options: string[];
  multiSelectLimit?: boolean;
  maxSelectLimit?: number | null;
};

const MultiChoiceQuestion = ({
  id,
  options,
  hasLimit,
  description,
  isFocused,
}: OptionQuestionProps & {
  isFocused: boolean;
}) => {
  const focusedlimitError = useSelector(
    (state: RootState) => state.form.focusedlimitError
  );
  const dispatch = useDispatch();

  const handleOptionAdd = () => {
    dispatch(
      addQuestionOptions({
        id,
        option: `Option ${options.length + 1}`,
      })
    );
  };
  const handleOptionChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    dispatch(
      updatedQuestionOptionsText({
        id,
        index,
        text: value,
      })
    );
  };
  const handleOptionDelete = (index: number) => {
    dispatch(deleteQuestionOptions({ id, optionIndx: index }));
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {options.map((opt, index) => (
            <div
              className="text-sm flex items-center gap-2"
              key={`multichoice-${index}`}
            >
              <div className="w-4 h-4 rounded-full border border-slate-200"></div>
              <input
                disabled={!isFocused}
                type="text"
                className="w-full focus:border-b-[0.5px] focus:border-midnight placeholder:opacity-40"
                value={opt}
                placeholder="untitled option"
                onChange={(e) => handleOptionChange(e, index)}
              />
              {options.length >= 2 && (
                <button
                  disabled={!isFocused}
                  onClick={() => handleOptionDelete(index)}
                  className="opacity-40 hover:opacity-100 cursor-pointer"
                >
                  <RxCross2 />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="text-sm flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-slate-200"></div>
          <button
            disabled={!isFocused}
            onClick={handleOptionAdd}
            className="text-violet cursor-pointer hover:underline hover:underline-offset-2"
          >
            Add Option
          </button>
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-violet">MULTICHOICE</p>
        </div>
        {hasLimit && (
          <div className="text-sm flex flex-col gap-2 text-midnight opacity-75">
            <h5 className="">EXTRA VALIDATION</h5>
            <div className="flex items-center gap-4">
              <label htmlFor="" className="">
                Description:
              </label>
              <input
                disabled={!isFocused || !hasLimit}
                type="text"
                placeholder="Text here"
                value={description}
                name="description"
                onChange={(e) => {
                  const { name, value } = e.target;

                  dispatch(
                    updatedQuestion({
                      id,
                      updates: {
                        [name]: value,
                      },
                    })
                  );
                }}
                className="py-1 border-b border-dotted border-slate-200 focus:border-midnight focus:px-4 w-[90%] placeholder:text-sm"
              />
            </div>
            {isFocused && focusedlimitError.status && (
              <p className="text-hot">{focusedlimitError.message}</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MultiChoiceQuestion;
