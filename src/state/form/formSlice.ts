/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestionPropsType } from "../../CONSTANTS/questionTypes";

export type SectionsPropsType = {
  _id: string;
  order: number;
  title: string;
  description: string;
};

export type FormInfoPropsType = {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  hasSections: boolean;
  sections: SectionsPropsType[];
  message: string;
};

interface FormState {
  formInfo: FormInfoPropsType;
  questionLists: QuestionPropsType[];
  focusedQuestionId: string | null;
  focusedlimitError: {
    status: boolean;
    message: string;
  };
  currSectionInfo: SectionsPropsType | null;
}

const initialState: FormState = {
  formInfo: {
    id: "",
    title: "",
    description: "",
    isPublished: false,
    hasSections: false,
    sections: [],
    message: "",
  },
  questionLists: [],
  focusedQuestionId: null,
  focusedlimitError: {
    status: true,
    message: "",
  },
  currSectionInfo: null,
};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updatedFormInfo: (state, action) => {
      state.formInfo = action.payload;
    },
    updatedCurrSectionInfo: (state, action) => {
      state.currSectionInfo = action.payload;
    },
    updatedQuestionLists: (state, action) => {
      state.questionLists = action.payload;
    },

    onFormInfoChange: (
      state,
      action: PayloadAction<{ name: keyof FormInfoPropsType; value: string }>
    ) => {
      const { name, value } = action.payload;
      if (name in state.formInfo) (state.formInfo as any)[name] = value;
    },
    setFormInfo: (state, action: PayloadAction<Partial<FormInfoPropsType>>) => {
      state.formInfo = { ...state.formInfo, ...action.payload };
    },
    onSectionInfoChange: (
      state,
      action: PayloadAction<Partial<SectionsPropsType>>
    ) => {
      if (state.currSectionInfo)
        state.currSectionInfo = { ...state.currSectionInfo, ...action.payload };
    },
    addQuestion: (state, action: PayloadAction<QuestionPropsType>) => {
      state.questionLists.push(action.payload);
    },

    updatedFormSection: (
      state,
      action: PayloadAction<{
        hasSections: boolean;
        sections: SectionsPropsType[];
        currSectionInfo: SectionsPropsType | null;
      }>
    ) => {
      const { hasSections, sections, currSectionInfo } = action.payload;

      state.formInfo = {
        ...state.formInfo,
        hasSections,
        sections,
      };
      state.currSectionInfo = currSectionInfo;
    },
    updatedFormSectionData: (
      state,
      action: PayloadAction<{
        sections: SectionsPropsType[];
      }>
    ) => {
      const { sections } = action.payload;

      state.formInfo = {
        ...state.formInfo,
        sections,
      };
    },

    setFocusedQuestion: (state, action: PayloadAction<string | null>) => {
      state.focusedQuestionId = action.payload;
    },
    setFocusedLimitError: (
      state,
      action: PayloadAction<{
        status: boolean;
        message: string;
      }>
    ) => {
      state.focusedlimitError = action.payload;
    },
    updatedQuestion: (
      state,
      action: PayloadAction<{
        id: string;
        updates: Partial<QuestionPropsType>;
      }>
    ) => {
      const { id, updates } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );

      if (questionIndex !== -1) {
        state.questionLists[questionIndex] = {
          ...state.questionLists[questionIndex],
          ...updates,
        };
      }
    },
    addQuestionOptions: (
      state,
      action: PayloadAction<{
        id: string;
        option: string;
      }>
    ) => {
      const { id, option } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );
      if (questionIndex !== -1 && state.questionLists[questionIndex].options) {
        state.questionLists[questionIndex].options.push(option);
      }
    },
    addGridQuestionOptions: (
      state,
      action: PayloadAction<{
        id: string;
        type: "row" | "col";
        option: string;
      }>
    ) => {
      const { id, type, option } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );

      if (questionIndex !== -1) {
        if (type === "row" && state.questionLists[questionIndex].rowOptions) {
          state.questionLists[questionIndex].rowOptions.push(option);
        } else if (
          type === "col" &&
          state.questionLists[questionIndex].colOptions
        ) {
          state.questionLists[questionIndex].colOptions.push(option);
        }
      }
    },
    updatedQuestionOptionsText: (
      state,
      action: PayloadAction<{
        id: string;
        index: number;
        text: string;
      }>
    ) => {
      const { id, index, text } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );
      if (questionIndex !== -1 && state.questionLists[questionIndex].options) {
        state.questionLists[questionIndex].options[index] = text;
      }
    },
    updatedGridQuestionOptionsText: (
      state,
      action: PayloadAction<{
        id: string;
        type: "col" | "row";
        index: number;
        text: string;
      }>
    ) => {
      const { id, type, index, text } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );
      if (questionIndex !== -1) {
        if (type === "row" && state.questionLists[questionIndex].rowOptions) {
          state.questionLists[questionIndex].rowOptions[index] = text;
        } else if (
          type === "col" &&
          state.questionLists[questionIndex].colOptions
        ) {
          state.questionLists[questionIndex].colOptions[index] = text;
        }
      }
    },
    deleteQuestionOptions: (
      state,
      action: PayloadAction<{
        id: string;
        optionIndx: number;
      }>
    ) => {
      const { id, optionIndx } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );
      if (questionIndex !== -1 && state.questionLists[questionIndex].options) {
        state.questionLists[questionIndex].options = state.questionLists[
          questionIndex
        ].options.filter((_, index) => index !== optionIndx);
      }
    },
    deleteGridQuestionOptions: (
      state,
      action: PayloadAction<{
        id: string;
        type: "col" | "row";
        optionIndx: number;
      }>
    ) => {
      const { id, type, optionIndx } = action.payload;
      const questionIndex = state.questionLists.findIndex(
        (question) => question._id === id
      );
      if (questionIndex !== -1) {
        if (type === "row" && state.questionLists[questionIndex].rowOptions) {
          state.questionLists[questionIndex].rowOptions = state.questionLists[
            questionIndex
          ].rowOptions.filter((_, index) => index !== optionIndx);
        } else if (
          type === "col" &&
          state.questionLists[questionIndex].colOptions
        ) {
          state.questionLists[questionIndex].colOptions = state.questionLists[
            questionIndex
          ].colOptions.filter((_, index) => index !== optionIndx);
        }
      }
    },
  },
});

export const {
  updatedFormInfo,
  updatedCurrSectionInfo,
  updatedQuestionLists,
  setFormInfo,
  onFormInfoChange,
  onSectionInfoChange,
  // --------------------------------------

  addQuestion,
  setFocusedQuestion,
  setFocusedLimitError,
  updatedQuestion,
  addQuestionOptions,
  addGridQuestionOptions,
  updatedQuestionOptionsText,
  updatedGridQuestionOptionsText,
  deleteQuestionOptions,
  deleteGridQuestionOptions,
  updatedFormSection,
  updatedFormSectionData,
} = formSlice.actions;
export default formSlice.reducer;
