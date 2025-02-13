import QuestionLayout from "../layouts/QuestionLayout";
import ShortResponse from "./ShortResponse";
import ParagraphResponse from "./ParagraphResponse";
import MultiChoiceResponse from "./MultiChoiceResponse";
import MultiChoiceGridResponse from "./MultiChoiceGridResponse";
import DropdownResponse from "./DropdownResponse";
import CheckboxResponse from "./CheckboxResponse";
import CheckboxGridResponse from "./CheckboxGridResponse";
import LinearScaleResponse from "./LinearScaleResponse";
import DateResponse from "./DateResponse";
import { MdEditNote } from "react-icons/md";
import { MdErrorOutline } from "react-icons/md";
import { QuestionResponseType } from "../../type/module";

const ResponseSelect = ({
  _id,
  question,
  questionType,
  isRequired,
  options,
  rowOptions,
  colOptions,
  dateOptions,
  allowedDateRange,
  allowedTimeRange,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  hasLimit,
  description,
  wordLimit,
  multiSelectLimit,
  maxSelectLimit,
  response,
  isError,
  errMessage,
}: QuestionResponseType) => {
  const renderResponse = () => {
    switch (questionType) {
      case "shortAnswer":
        return (
          <ShortResponse
            id={_id}
            response={response}
            isRequired={isRequired}
            hasLimit={hasLimit}
            wordLimit={wordLimit || null}
          />
        );
      case "paragraph":
        return (
          <ParagraphResponse
            id={_id}
            response={response}
            isRequired={isRequired}
            hasLimit={hasLimit}
            wordLimit={wordLimit || null}
          />
        );
      case "multiChoice":
        return (
          <MultiChoiceResponse
            id={_id}
            options={options || []}
            isRequired={isRequired}
            response={response}
          />
        );
      case "dropdown":
        return (
          <DropdownResponse
            id={_id}
            options={options || []}
            response={response}
            hasLimit={hasLimit}
            multiSelectLimit={multiSelectLimit as boolean}
            maxSelectLimit={maxSelectLimit as number | null}
            isRequired={isRequired}
          />
        );
      case "checkboxes":
        return (
          <CheckboxResponse
            id={_id}
            options={options || []}
            response={response}
            hasLimit={hasLimit}
            isRequired={isRequired}
            maxSelectLimit={maxSelectLimit as number | null}
          />
        );
      case "linearScale":
        return (
          <LinearScaleResponse
            id={_id}
            minValue={minValue || 0}
            maxValue={maxValue || 5}
            minLabel={minLabel}
            maxLabel={maxLabel}
            response={response}
            isRequired={isRequired}
          />
        );
      case "date":
        return (
          <DateResponse
            id={_id}
            dateOptions={dateOptions || "both"}
            response={response}
            isRequired={isRequired}
            allowedDateRange={allowedDateRange as boolean}
            allowedTimeRange={allowedTimeRange as boolean}
          />
        );
      case "multiChoiceGrid":
        return (
          <MultiChoiceGridResponse
            id={_id}
            rowOptions={rowOptions || []}
            colOptions={colOptions || []}
            response={response}
            isRequired={isRequired}
          />
        );
      case "checkboxGrid":
        return (
          <CheckboxGridResponse
            id={_id}
            rowOptions={rowOptions || []}
            colOptions={colOptions || []}
            response={response}
            hasLimit={hasLimit}
            maxSelectLimit={maxSelectLimit as number | null}
            isRequired={isRequired}
          />
        );
      default:
        return null;
    }
  };
  // console.log(questionType);
  return (
    <QuestionLayout>
      <div className="p-4 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-midnight font-bold text-xl">
            {question} {isRequired && <span className="text-hot">*</span>}
          </h1>
          {hasLimit && description && (
            <div className="text-midnight opacity-85 text-sm flex items-start gap-1">
              <MdEditNote className="mt-1" />
              <p>{description}</p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-0.5">
          {renderResponse()}
          {isError && (
            <div className="flex items-center gap-2 text-hot text-sm">
              <MdErrorOutline />
              <p>{errMessage}</p>
            </div>
          )}
        </div>
      </div>
    </QuestionLayout>
  );
};

export default ResponseSelect;
