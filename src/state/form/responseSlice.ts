/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormInfoPropsType, SectionsPropsType } from "./formSlice";
import { QuestionPropsType } from "../../CONSTANTS/questionTypes";
import { AnswerResponseType, FormAnswerType } from "../../type/module";

interface ResponseState {
  formInfo: FormInfoPropsType;
  currSectionInfo: SectionsPropsType | null;
  answerLists: AnswerResponseType[];
  responseLists: FormAnswerType[];
  step: {
    currStep: number;
    isLastStep: boolean;
  };
  submitToggle: {
    isValid: boolean;
    isSubmit: boolean;
  };
  sharedInfo: {
    url: string;
    isCopy: boolean;
  };
}

const initialState: ResponseState = {
  formInfo: {
    id: "",
    title: "",
    description: "",
    isPublished: false,
    hasSections: false,
    sections: [],
    message: "",
  },
  step: { currStep: 0, isLastStep: false },
  currSectionInfo: null,
  answerLists: [],
  responseLists: [],
  submitToggle: {
    isValid: false,
    isSubmit: false,
  },
  sharedInfo: {
    url: "",
    isCopy: false,
  },
};

const responseSlice = createSlice({
  name: "response",
  initialState,
  reducers: {
    updatedFormInfo: (state, action) => {
      state.formInfo = action.payload;
    },
    updatedResponseLists: (state, action) => {
      const question = action.payload ?? []; // Ensure payload is not undefined

      const responses = question.map(
        (quest: QuestionPropsType): FormAnswerType => {
          let response;
          switch (quest.questionType) {
            case "shortAnswer":
            case "paragraph":
              response = "";
              break;
            case "dropdown":
            case "checkboxes":
              response = [];
              break;
            case "multiChoiceGrid":
              response = (quest.colOptions ?? []).reduce(
                (acc: Record<string, string>, _, colIdx) => {
                  acc[colIdx] = "";
                  return acc;
                },
                {} as Record<string, string>
              );
              break;
            case "checkboxGrid":
              response = (quest.colOptions ?? []).reduce(
                (acc: Record<string, string[]>, _, colIdx) => {
                  acc[colIdx] = [];
                  return acc;
                },
                {} as Record<string, string[]>
              );
              break;
            case "linearScale":
            case "multiChoice":
              response = ""; // Use empty string instead of null
              break;
            case "date":
              response = {
                startDate: null,
                endDate: null,
                startTime: null,
                endTime: null,
              };
              break;
            default:
              response = ""; // Default to empty string
          }

          return {
            questionId: quest._id,
            questionType: quest.questionType,
            response,
            isRequired: quest.isRequired ?? false,
            isError: false,
            errMessage: "",
          };
        }
      );

      state.responseLists = responses;
    },

    updatedCurrSectionInfo: (state, action) => {
      const sectionInfo = action.payload;
      state.currSectionInfo = sectionInfo;

      if (state.formInfo.hasSections) {
        const lastSectionOrder = state.formInfo.sections.length - 1;
        const currIdx = state.formInfo.sections.findIndex(
          (section) => section._id === sectionInfo._id
        );
        if (currIdx !== -1) {
          state.step = {
            currStep: currIdx,
            isLastStep: lastSectionOrder === currIdx,
          };
        }
      }
    },
    updatedAnswerLists: (state, action) => {
      state.answerLists = action.payload;
    },
    onLinkCopy: (state, action: PayloadAction<boolean>) => {
      state.sharedInfo.isCopy = action.payload;
    },
    updatedQuestionError: (
      state,
      action: PayloadAction<{
        id: string;
        isError: boolean;
        errMessage: string;
      }>
    ) => {
      const { id, isError, errMessage } = action.payload;
      const answerIndex = state.responseLists.findIndex(
        (answer) => answer.questionId === id
      );

      if (answerIndex !== -1) {
        state.responseLists[answerIndex].isError = isError;
        state.responseLists[answerIndex].errMessage = errMessage;
      }
    },
    addQuestionResponse: (
      state,
      action: PayloadAction<{
        id: string;
        response: any;
      }>
    ) => {
      const { id, response } = action.payload;
      const answerIndex = state.responseLists.findIndex(
        (answer) => answer.questionId === id
      );

      if (answerIndex !== -1) {
        state.responseLists[answerIndex].response = response;
      }
    },
  },
});

export const {
  updatedFormInfo,
  updatedCurrSectionInfo,
  updatedResponseLists,
  updatedAnswerLists,
  onLinkCopy,
  updatedQuestionError,
  addQuestionResponse,
} = responseSlice.actions;
export default responseSlice.reducer;
