import { useState } from "react";
import { DefaultQuestonProps } from "./ShortQuestion";
import { useDispatch, useSelector } from "react-redux";
import { updatedQuestion } from "../../state/form/formSlice";
import { RootState } from "../../state/store";

type DateQuestionProps = DefaultQuestonProps & {
  dateOptions: string;
  allowedDateRange: boolean;
  allowedTimeRange: boolean;
};

const DateQuestion = ({
  id,
  dateOptions,
  hasLimit,
  description,
  allowedDateRange,
  allowedTimeRange,
  isFocused,
}: DateQuestionProps & {
  isFocused: boolean;
}) => {
  const focusedlimitError = useSelector(
    (state: RootState) => state.form.focusedlimitError
  );
  const dispatch = useDispatch();
  const [requiredType, setRequiredType] = useState({
    date: dateOptions === "date" || dateOptions === "both",
    time: dateOptions === "time" || dateOptions === "both",
  });

  console.log(dateOptions);

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <div>
          <div className="flex items-center gap-6">
            {/* Need Date */}
            <div className="flex gap-2">
              <input
                disabled={!isFocused}
                type="checkbox"
                checked={requiredType.date}
                id="date"
                className="accent-midnight"
                onChange={(e) => {
                  setRequiredType((prev) => {
                    const updatedType = { ...prev, date: e.target.checked };
                    dispatch(
                      updatedQuestion({
                        id,
                        updates: {
                          dateOptions:
                            updatedType.date && updatedType.time
                              ? "both"
                              : updatedType.date
                              ? "date"
                              : "time",
                        },
                      })
                    );
                    return updatedType;
                  });
                }}
              />
              <label htmlFor="date" className="">
                Required Date
              </label>
            </div>
            {/* Need Date Range */}
            <div className="flex gap-2">
              <input
                disabled={!isFocused || !requiredType.date}
                type="checkbox"
                checked={allowedDateRange}
                id="allowedDateRange"
                className="accent-midnight"
                onChange={(e) => {
                  dispatch(
                    updatedQuestion({
                      id,
                      updates: {
                        allowedDateRange: e.target.checked,
                      },
                    })
                  );
                }}
              />
              <label htmlFor="allowedDateRange" className="">
                Required Date Range
              </label>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {/* Need Time */}
            <div className="flex gap-2">
              <input
                disabled={!isFocused}
                type="checkbox"
                checked={requiredType.time}
                id="time"
                className="accent-midnight"
                onChange={(e) => {
                  setRequiredType((prev) => {
                    const updatedType = { ...prev, time: e.target.checked };
                    dispatch(
                      updatedQuestion({
                        id,
                        updates: {
                          dateOptions:
                            updatedType.date && updatedType.time
                              ? "both"
                              : updatedType.date
                              ? "date"
                              : "time",
                        },
                      })
                    );
                    return updatedType;
                  });
                }}
              />
              <label htmlFor="time" className="">
                Required Time
              </label>
            </div>
            {/* Need Time Range */}
            <div className="flex gap-2">
              <input
                disabled={!isFocused || !requiredType.time}
                type="checkbox"
                checked={allowedTimeRange}
                id="allowedTimeRange"
                className="accent-midnight"
                onChange={(e) => {
                  dispatch(
                    updatedQuestion({
                      id,
                      updates: {
                        allowedTimeRange: e.target.checked,
                      },
                    })
                  );
                }}
              />
              <label htmlFor="allowedTimeRange" className="">
                Required Time Range
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-violet">DATE OR TIME</p>
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

      {/* <div className="border-t-[0.5px] border-violet py-1.5 text-midnight flex justify-end items-center">
        {isFocused ? (
          <button
            onClick={() => {
              if (dateQuestion.hasLimit && !dateQuestion.description) {
                setHasError("Please add validations");
                return;
              }
              const body = {
                ...dateQuestion,
                dateOptions:
                  requiredType.date && requiredType.time
                    ? "both"
                    : requiredType.date && !requiredType.time
                    ? "date"
                    : "time",
              };
              onQuestionConfirm(id, body);
            }}
            className="px-2 cursor-pointer text-hot"
          >
            <LuSaveAll />
          </button>
        ) : (
          <button
            disabled={currFocusId !== null && currFocusId !== id}
            onClick={() => onQuestionEdit(id)}
            className="px-2 cursor-pointer disabled:text-slate-200"
          >
            <FaRegEdit />
          </button>
        )}
        <button
          disabled={!isFocused}
          onClick={() => {
            setHasError("");
            if (dateQuestion.hasLimit) {
              setDateQuestion((prev) => ({
                ...prev,
                description: "",
                allowedRange: false,
              }));
            }
            setDateQuestion((prev) => ({ ...prev, hasLimit: !prev.hasLimit }));
          }}
          className={`px-2 cursor-pointer disabled:text-slate-200 ${
            dateQuestion.hasLimit ? "text-hot" : ""
          }`}
        >
          <IoMdOptions />
        </button>
        <button
          onClick={() => onQuestionDelete(id)}
          className="border-r-[0.5px] border-violet px-2 cursor-pointer"
        >
          <FaRegTrashCan />
        </button>
        <div className="text-sm px-4 flex items-center gap-2">
          <p className="">Required</p>
          <SlideToggleSwitch
            isChecked={dateQuestion.isRequired}
            isDisabled={!isFocused}
            onCheckboxChange={(e) =>
              setDateQuestion((prev) => ({
                ...prev,
                isRequired: e.target.checked,
              }))
            }
          />
        </div>
      </div> */}
    </>
  );
};

export default DateQuestion;
