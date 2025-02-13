import { useMemo } from "react";
import Select from "react-select";
import { DefaultQuestonProps } from "./ShortQuestion";
import { useDispatch, useSelector } from "react-redux";
import { updatedQuestion } from "../../state/form/formSlice";
import { RootState } from "../../state/store";

type SelectType = {
  label: string;
  value: number;
};

type LinearScaleProps = DefaultQuestonProps & {
  minValue?: number | null;
  maxValue?: number | null;
  minLabel?: string;
  maxLabel?: string;
};

const numberSelectFunc = (min: number, max: number): SelectType[] => {
  const arr: SelectType[] = [];

  for (let i = min; i <= max; i++) {
    const opt: SelectType = {
      value: i,
      label: `${i}`,
    };
    arr.push(opt);
  }

  return arr;
};

const LinearScaleQuestion = ({
  id,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  hasLimit,
  description,
  isFocused,
}: LinearScaleProps & {
  isFocused: boolean;
}) => {
  const minSelect = numberSelectFunc(0, 1);
  const maxSelect = numberSelectFunc(2, 10);
  const focusedlimitError = useSelector(
    (state: RootState) => state.form.focusedlimitError
  );
  const dispatch = useDispatch();

  const minValueOpt = useMemo(
    () => ({
      label: minValue ? `${minValue}` : "0",
      value: minValue ?? 0,
    }),
    [minValue]
  );

  const maxValueOpt = useMemo(
    () => ({
      label: maxValue ? `${maxValue}` : "5",
      value: maxValue ?? 5,
    }),
    [maxValue]
  );

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        <div className="grid grid-cols-[1fr_20px_1fr] gap-2 items-center">
          <Select
            isDisabled={!isFocused}
            options={minSelect}
            value={minValueOpt}
            styles={{
              control: (styles, state) => ({
                ...styles,
                backgroundColor: "transparent",
                height: "1.25rem",
                width: "100%",
                border: "none",
                borderBottom: state.isFocused
                  ? "1px solid #504e76"
                  : '"1px solid #E2E8F1"',
                borderRadius: "0px",
                caretColor: "transparent",
                boxShadow: "none",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                display: "none",
              }),
            }}
            onChange={(newValue) => {
              dispatch(
                updatedQuestion({
                  id,
                  updates: {
                    minValue: newValue ? newValue.value : null,
                  },
                })
              );
            }}
          />
          <p className="text-sm text-center">to</p>
          <Select
            isDisabled={!isFocused}
            options={maxSelect}
            value={maxValueOpt}
            styles={{
              control: (styles, state) => ({
                ...styles,
                backgroundColor: "transparent",
                height: "1.25rem",
                width: "100%",
                border: "none",
                borderBottom: state.isFocused
                  ? "1px solid #504e76"
                  : '"1px solid #E2E8F1"',
                borderRadius: "0px",
                caretColor: "transparent",
                boxShadow: "none",
              }),
              indicatorSeparator: (styles) => ({
                ...styles,
                display: "none",
              }),
            }}
            onChange={(newValue) => {
              dispatch(
                updatedQuestion({
                  id,
                  updates: {
                    maxValue: newValue ? newValue.value : null,
                  },
                })
              );
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-sm flex items-center gap-2">
            <div className="">{minValueOpt.label}-</div>
            <input
              type="text"
              disabled={!isFocused}
              className="w-full focus:border-b-[0.5px] focus:border-midnight placeholder:opacity-40"
              value={minLabel}
              placeholder="label (optional)"
              onChange={(e) =>
                dispatch(
                  updatedQuestion({
                    id,
                    updates: {
                      minLabel: e.target.value,
                    },
                  })
                )
              }
            />
          </div>
          <div className="text-sm flex items-center gap-2">
            <div className="">{maxValueOpt.label}-</div>
            <input
              type="text"
              disabled={!isFocused}
              className="w-full focus:border-b-[0.5px] focus:border-midnight placeholder:opacity-40"
              value={maxLabel}
              placeholder="label (optional)"
              onChange={(e) =>
                dispatch(
                  updatedQuestion({
                    id,
                    updates: {
                      maxLabel: e.target.value,
                    },
                  })
                )
              }
            />
          </div>
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-violet">LINEARSCALE</p>
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

export default LinearScaleQuestion;
