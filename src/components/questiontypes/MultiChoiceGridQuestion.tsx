import { ChangeEvent } from "react";
import { RxCross2 } from "react-icons/rx";
import { DefaultQuestonProps } from "./ShortQuestion";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {
  addGridQuestionOptions,
  deleteGridQuestionOptions,
  updatedGridQuestionOptionsText,
  updatedQuestion,
} from "../../state/form/formSlice";

export type GridOptionQuestionProps = DefaultQuestonProps & {
  rowOptions: string[];
  colOptions: string[];
  multiSelectLimit?: boolean;
  maxSelectLimit?: number | null;
};

const MultiChoiceGridQuestion = ({
  id,
  rowOptions,
  colOptions,
  hasLimit,
  description,
  isFocused,
}: GridOptionQuestionProps & {
  isFocused: boolean;
}) => {
  const focusedlimitError = useSelector(
    (state: RootState) => state.form.focusedlimitError
  );
  const dispatch = useDispatch();

  const handleOptionAdd = (type: "row" | "col") => {
    dispatch(
      addGridQuestionOptions({
        id,
        type,
        option:
          type === "row"
            ? `Row ${rowOptions.length + 1}`
            : `Col ${colOptions.length + 1}`,
      })
    );
  };
  const handleOptionChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "row" | "col",
    index: number
  ) => {
    const value = e.target.value;
    console.log(value);
    dispatch(
      updatedGridQuestionOptionsText({
        id,
        type,
        index,
        text: value,
      })
    );
  };
  const handleOptionDelete = (type: "col" | "row", index: number) => {
    dispatch(deleteGridQuestionOptions({ id, type, optionIndx: index }));
  };
  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
          <div className="flex flex-col gap-2">
            <h5 className="font-medium border-b border-violet border-dashed">
              ROW
            </h5>
            <div className="flex flex-col gap-1">
              {rowOptions.map((opt, index) => (
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
                    onChange={(e) => handleOptionChange(e, "row", index)}
                  />
                  {rowOptions.length >= 2 && (
                    <button
                      disabled={!isFocused}
                      onClick={() => handleOptionDelete("row", index)}
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
                onClick={() => handleOptionAdd("row")}
                className="text-violet cursor-pointer hover:underline hover:underline-offset-2"
              >
                Add Option
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-medium border-b border-violet border-dashed">
              COL
            </h5>
            <div className="flex flex-col gap-1">
              {colOptions.map((opt, index) => (
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
                    onChange={(e) => handleOptionChange(e, "col", index)}
                  />
                  {colOptions.length >= 2 && (
                    <button
                      disabled={!isFocused}
                      onClick={() => handleOptionDelete("col", index)}
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
                onClick={() => handleOptionAdd("col")}
                className="text-violet cursor-pointer hover:underline hover:underline-offset-2"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <p className="text-xs text-violet">MULTICHOICEGRID</p>
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

export default MultiChoiceGridQuestion;
