import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";

const ShortResponse = ({
  id,
  response,
  isRequired,
  hasLimit,
  wordLimit,
}: {
  id: string;
  response: string;
  isRequired: boolean;
  hasLimit: boolean;
  wordLimit: number | null;
}) => {
  const dispatch = useDispatch();
  const handleAnswerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    dispatch(addQuestionResponse({ id, response: value }));

    if (isRequired && !value.trim()) {
      dispatch(
        updatedQuestionError({
          id,
          isError: true,
          errMessage: "This field is required!",
        })
      );
      return;
    }

    dispatch(
      updatedQuestionError({
        id,
        isError: false,
        errMessage: "",
      })
    );
  };
  return (
    <div className="flex flex-col gap-0.5 md:w-1/3 ">
      <input
        type="text"
        id={id}
        name={id}
        placeholder="Your Answer"
        value={response}
        onChange={handleAnswerChange}
        maxLength={wordLimit && wordLimit > 10 ? wordLimit : undefined}
        className="border-b py-1.5 border-slate-200 focus:border-midnight focus:px-4 placeholder:text-sm"
      />
      {hasLimit && wordLimit && (
        <div className="flex justify-end">
          <p
            className={`${
              response.length <= wordLimit ? "text-slate-400" : "text-hot"
            } text-sm`}
          >
            {response.length}/{wordLimit}
          </p>
        </div>
      )}
    </div>
  );
};

export default ShortResponse;
