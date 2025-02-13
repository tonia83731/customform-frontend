import { useDispatch, useSelector } from "react-redux";
import { updatedQuestion } from "../../state/form/formSlice";
import { RootState } from "../../state/store";

export type DefaultQuestonProps = {
  id: string;
  hasLimit: boolean;
  description?: string;
  wordLimit?: number | null;
};

const ShortQuestion = ({
  id,
  isFocused,
  hasLimit,
  description,
  wordLimit,
}: DefaultQuestonProps & {
  isFocused: boolean;
}) => {
  const focusedlimitError = useSelector(
    (state: RootState) => state.form.focusedlimitError
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
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
                  WordLimits:
                </label>
                <input
                  disabled={!isFocused || !hasLimit}
                  type="number"
                  placeholder="0"
                  value={wordLimit || undefined}
                  name="wordLimit"
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
            </div>
            {isFocused && focusedlimitError.status && (
              <p className="text-hot">{focusedlimitError.message}</p>
            )}
          </div>
        )}
      </div>
      <div className="flex justify-end">
        <p className="text-xs text-violet">SHORT ANSWER</p>
      </div>
    </>
  );
};

export default ShortQuestion;
