/* eslint-disable @typescript-eslint/no-explicit-any */
import { QuestionPropsType } from "../../CONSTANTS/questionTypes";
import { GrDrag } from "react-icons/gr";
import QuestionLayout from "../layouts/QuestionLayout";
import CheckboxQuestion from "./CheckboxQuestion";
import DateQuestion from "./DateQuestion";
import DropdownQuestion from "./DropdownQuestion";
import LinearScaleQuestion from "./LinearScaleQuestion";
import MultiChoiceQuestion from "./MultiChoiceQuestion";
import ParagraphQuestion from "./ParagraphQuestion";
import ShortQuestion from "./ShortQuestion";
import MultiChoiceGridQuestion from "./MultiChoiceGridQuestion";
import CheckboxGridQuestion from "./CheckboxGridQuestion";

import SlideToggleSwitch from "../inputtypes/SlideToggleSwitch";
import { FaRegEdit } from "react-icons/fa";
import { LuSaveAll } from "react-icons/lu";
import { FaRegTrashCan } from "react-icons/fa6";
import { IoMdOptions } from "react-icons/io";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import {
  // initializedQuestionLists,
  updatedQuestionLists,
  setFocusedLimitError,
  setFocusedQuestion,
  updatedQuestion,
} from "../../state/form/formSlice";
import { axiosFetch } from "../../api";
import { useParams } from "react-router";

const QuestionSelect = ({
  _id,
  questionType,
  question,
  options,
  rowOptions,
  colOptions,
  dateOptions,
  minValue,
  maxValue,
  minLabel,
  maxLabel,
  hasLimit,
  description,
  wordLimit,
  multiSelectLimit,
  maxSelectLimit,
  allowedDateRange,
  allowedTimeRange,
  isRequired,
}: // order,
QuestionPropsType) => {
  // console.log(order);
  const { formId } = useParams();
  const questionLists = useSelector(
    (state: RootState) => state.form.questionLists
  );
  const focusedQuestionId = useSelector(
    (state: RootState) => state.form.focusedQuestionId
  );

  const isFocused =
    focusedQuestionId && focusedQuestionId === _id ? true : false;
  const dispatch = useDispatch();

  const handleDeleteQuestion = async () => {
    try {
      const res = await axiosFetch(
        "DELETE",
        `/forms/${formId}/${_id}/delete-question`
      );
      if (res?.data.success) {
        const updated_questionlists = questionLists.filter(
          (question: QuestionPropsType) => question._id !== _id
        );
        dispatch(updatedQuestionLists(updated_questionlists));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuestionSave = async (id: string) => {
    dispatch(
      setFocusedLimitError({
        status: false,
        message: "",
      })
    );
    let err;
    // checked hasLimit
    if (hasLimit) {
      switch (questionType) {
        case "shortAnswer":
        case "paragraph":
          if (!description?.trim() && !wordLimit) {
            err =
              "Validation cannot be blank. Add validations or turn off validation button";
          } else if (wordLimit && wordLimit <= 10) {
            err = "WordLimit cannot be smaller than 10";
          }
          break;
        case "multiChoice":
        case "multiChoiceGrid":
        case "linearScale":
        case "date":
          if (!description?.trim()) {
            err =
              "Validation cannot be blank. Add validations or turn off validation button";
          }
          break;
        case "dropdown":
          if (!description?.trim() && !multiSelectLimit && !maxSelectLimit) {
            err =
              "Validation cannot be blank. Add validations or turn off validation button";
          } else if (
            maxSelectLimit &&
            options &&
            (maxSelectLimit < 1 || maxSelectLimit > options.length)
          ) {
            err = `Select numbers should be between 1-${options.length}`;
          }
          break;
        case "checkboxes":
          if (!description?.trim() && !maxSelectLimit) {
            err =
              "Validation cannot be blank. Add validations or turn off validation button";
          } else if (
            maxSelectLimit &&
            options &&
            (maxSelectLimit < 1 || maxSelectLimit > options.length)
          ) {
            err = `Select numbers should be between 1-${options.length}`;
          }
          break;
        case "checkboxGrid":
          if (!description?.trim() && !maxSelectLimit) {
            err =
              "Validation cannot be blank. Add validations or turn off validation button";
          } else if (
            maxSelectLimit &&
            rowOptions &&
            (maxSelectLimit < 1 || maxSelectLimit > rowOptions.length)
          ) {
            err = `Select numbers should be between 1-${rowOptions.length}`;
          }
          break;
        default:
          break;
      }
    }
    if (err) {
      dispatch(
        setFocusedLimitError({
          status: true,
          message: err,
        })
      );
      return;
    }
    const body = questionLists.find((question) => question._id === id);
    if (!body) return;
    try {
      const res = await axiosFetch(
        "PUT",
        `/forms/${_id}/edit-question`,
        true,
        body
      );
      if (res?.data.success) {
        dispatch(setFocusedQuestion(null));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderQuestion = () => {
    switch (questionType) {
      case "shortAnswer":
        return (
          <ShortQuestion
            id={_id}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            wordLimit={wordLimit}
          />
        );
      case "paragraph":
        return (
          <ParagraphQuestion
            id={_id}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            wordLimit={wordLimit}
          />
        );
      case "multiChoice":
        return (
          <MultiChoiceQuestion
            id={_id}
            options={options || []}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
          />
        );
      case "dropdown":
        return (
          <DropdownQuestion
            id={_id}
            options={options || []}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            multiSelectLimit={multiSelectLimit}
            maxSelectLimit={maxSelectLimit}
          />
        );
      case "checkboxes":
        return (
          <CheckboxQuestion
            id={_id}
            options={options || []}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            maxSelectLimit={maxSelectLimit}
          />
        );
      case "linearScale":
        return (
          <LinearScaleQuestion
            id={_id}
            minValue={minValue}
            maxValue={maxValue}
            minLabel={minLabel}
            maxLabel={maxLabel}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
          />
        );
      case "date":
        return (
          <DateQuestion
            id={_id}
            dateOptions={dateOptions || "both"}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            allowedDateRange={allowedDateRange as boolean}
            allowedTimeRange={allowedTimeRange as boolean}
          />
        );
      case "multiChoiceGrid":
        return (
          <MultiChoiceGridQuestion
            id={_id}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            rowOptions={rowOptions || []}
            colOptions={colOptions || []}
          />
        );
      case "checkboxGrid":
        return (
          <CheckboxGridQuestion
            id={_id}
            isFocused={isFocused}
            hasLimit={hasLimit}
            description={description}
            maxSelectLimit={maxSelectLimit}
            rowOptions={rowOptions || []}
            colOptions={colOptions || []}
          />
        );
      default:
        return null;
    }
  };

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: _id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionLayout>
        <div
          className="w-full flex justify-center items-center opacity-20 hover:opacity-100 cursor-grab"
          {...listeners}
        >
          <GrDrag className="rotate-90" />
        </div>

        <div className="p-4 flex flex-col gap-4">
          {isFocused ? (
            <textarea
              disabled={!isFocused}
              value={question}
              name="question"
              placeholder="Question"
              className="w-full h-auto overflow-hidden text-lg font-bold resize-y text-midnight placeholder:text-violet border-b border-slate-200 focus:border-midnight focus:px-4 focus:bg-slate-100"
              rows={1}
              onChange={(e) => {
                const { name, value } = e.target;

                dispatch(
                  updatedQuestion({
                    id: _id,
                    updates: {
                      [name]: value,
                    },
                  })
                );
              }}
            />
          ) : (
            <div
              className={`w-full min-h-10 h-auto text-lg font-bold resize-none ${
                question ? "text-midnight" : "text-violet"
              } border-b border-slate-200`}
            >
              {question || "Question"}
            </div>
          )}
          {renderQuestion()}
        </div>
        <div className="border-t-[0.5px] border-violet py-1.5 text-midnight flex justify-end items-center">
          {isFocused ? (
            <button
              onClick={() => handleQuestionSave(_id)}
              className="px-2 cursor-pointer text-hot"
            >
              <LuSaveAll />
            </button>
          ) : (
            <button
              disabled={focusedQuestionId !== null && !isFocused}
              onClick={() => {
                dispatch(setFocusedQuestion(_id));
              }}
              className="px-2 cursor-pointer disabled:text-slate-200"
            >
              <FaRegEdit />
            </button>
          )}
          <button
            disabled={!isFocused}
            onClick={() => {
              if (hasLimit) {
                dispatch(
                  setFocusedLimitError({
                    status: false,
                    message: "",
                  })
                );
                dispatch(
                  updatedQuestion({
                    id: _id,
                    updates: {
                      description: "",
                      wordLimit: null,
                      multiSelectLimit: false,
                      maxSelectLimit: null,
                    },
                  })
                );
              }
              dispatch(
                updatedQuestion({
                  id: _id,
                  updates: {
                    hasLimit: !hasLimit,
                  },
                })
              );
            }}
            className={`px-2 cursor-pointer disabled:text-slate-200 ${
              hasLimit ? "text-hot" : ""
            }`}
          >
            <IoMdOptions />
          </button>
          <button
            onClick={handleDeleteQuestion}
            className="border-r-[0.5px] border-violet px-2 cursor-pointer"
          >
            <FaRegTrashCan />
          </button>
          <div className="text-sm px-4 flex items-center gap-2">
            <p className="">Required</p>
            <SlideToggleSwitch
              name="isRequired"
              isChecked={isRequired}
              isDisabled={!isFocused}
              onCheckboxChange={(e) => {
                const { name, checked } = e.target;
                dispatch(
                  updatedQuestion({
                    id: _id,
                    updates: {
                      [name]: checked,
                    },
                  })
                );
              }}
            />
          </div>
        </div>
      </QuestionLayout>
    </div>
  );
};

export default QuestionSelect;
