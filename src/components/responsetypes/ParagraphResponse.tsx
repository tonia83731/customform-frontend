import { ChangeEvent } from "react";
import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";

const ParagraphResponse = ({
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
  const handleAnswerChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className="flex flex-col gap-0.5">
      <textarea
        id={id}
        name={id}
        placeholder="Your Answer"
        rows={3}
        value={response}
        onChange={handleAnswerChange}
        maxLength={wordLimit && wordLimit > 10 ? wordLimit : undefined}
        className="resize-y py-1.5 border-b border-slate-200 focus:border-midnight focus:px-4 placeholder:text-sm"
      ></textarea>
      {hasLimit && wordLimit && (
        <div className="flex justify-end">
          <p className="text-slate-400 text-sm">
            {response.length || 0}/{wordLimit}
          </p>
        </div>
      )}
    </div>
  );
};

export default ParagraphResponse;
