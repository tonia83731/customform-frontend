import { ChangeEvent } from "react";
import { OptionQuestionProps } from "./MultiChoiceQuestion";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineFormatListNumbered } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {
  addQuestionOptions,
  deleteQuestionOptions,
  updatedQuestion,
  updatedQuestionOptionsText,
} from "../../state/form/formSlice";

const DropdownQuestion = ({
  id,
  options,
  hasLimit,
  description,
  multiSelectLimit,
  maxSelectLimit,
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
        <div className="flex flex-col gap-2 list-decimal">
          {options.map((opt, index) => (
            <div
              className="text-sm flex items-center gap-2"
              key={`dropdown-${index}`}
            >
              <div className="">{index + 1}.</div>
              <input
                type="text"
                disabled={!isFocused}
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
          <MdOutlineFormatListNumbered />
          <button
            disabled={!isFocused}
            onClick={handleOptionAdd}
            className="text-violet cursor-pointer"
          >
            add option
          </button>
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-violet">DROPDOWN</p>
        </div>

        {hasLimit && (
          <div className="text-sm flex flex-col gap-2 text-midnight opacity-75">
            <h5 className="">EXTRA VALIDATION</h5>
            <div className="flex flex-col gap-1">
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
              <div className="flex items-center gap-4">
                <label htmlFor="" className="">
                  Select Limits:
                </label>
                <input
                  disabled={!isFocused || !hasLimit}
                  type="number"
                  placeholder="0"
                  value={maxSelectLimit || undefined}
                  name="maxSelectLimit"
                  onChange={(e) => {
                    const { name, value } = e.target;
                    const num = value ? Number(value) : null;

                    dispatch(
                      updatedQuestion({
                        id,
                        updates: {
                          [name]: num,
                        },
                      })
                    );
                  }}
                  className="py-1 border-b border-dotted text-center border-slate-200 focus:border-midnight focus:px-4 placeholder:text-sm"
                />
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={multiSelectLimit}
                  name="multiSelectLimit"
                  onChange={(e) => {
                    const { name, checked } = e.target;
                    dispatch(
                      updatedQuestion({
                        id,
                        updates: {
                          [name]: checked,
                        },
                      })
                    );
                  }}
                  className="accent-midnight"
                />
                <label htmlFor="" className="">
                  {multiSelectLimit ? "MultiSelect" : "SingleSelect"}
                </label>
              </div>
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

export default DropdownQuestion;
