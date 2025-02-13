/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormResponseType } from "../../type/module";

export type QuestionsDataResType = {
  question: string;
  questionId: string;
  questionType: string;
};

export type AnswersDataResType = {
  respondentId: string;
  [key: string]: any;
};

interface DataState {
  formInfo: {
    id: string;
    title: string;
    description: string;
  };
  questionData: QuestionsDataResType[];
  answerData: AnswersDataResType[];
}

const initialState: DataState = {
  formInfo: {
    id: "",
    title: "",
    description: "",
  },
  questionData: [],
  answerData: [],
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    updatedFormInfo: (state, action: PayloadAction<FormResponseType>) => {
      const form = action.payload;
      const formInfo = {
        id: form._id,
        title: form.title,
        description: form.description,
      };
      state.formInfo = formInfo;
    },
    updatedQuestionData: (
      state,
      action: PayloadAction<QuestionsDataResType[]>
    ) => {
      const questions = [
        {
          question: "No.",
          questionId: "rank",
          questionType: "",
        },
        ...action.payload,
      ];
      state.questionData = questions;
    },
    updatedAnswerData: (state, action: PayloadAction<AnswersDataResType[]>) => {
      state.answerData = action.payload;
    },
  },
});

export const { updatedFormInfo, updatedQuestionData, updatedAnswerData } =
  dataSlice.actions;

export default dataSlice.reducer;
