import { questionOptTypes } from "../CONSTANTS/questionTypes";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type FormResponseType = {
  _id: string;
  title: string;
  description: string;
  isPublished: boolean;
  lastEditAt: string;
  createdAt: string;
  updatedAt: string;
};

export type QuestionResponseType = {
  _id: string;
  formId: string;
  questionType: questionOptTypes;
  question: string;
  description?: string;
  options?: string[];
  rowOptions?: string[];
  colOptions?: string[];
  dateOptions?: string;
  minValue?: number | null;
  maxValue?: number | null;
  minLabel?: string;
  maxLabel?: string;
  hasLimit: boolean;
  wordLimit?: number | null;
  multiSelectLimit?: boolean;
  maxSelectLimit?: number | null;
  allowedDateRange?: boolean;
  allowedTimeRange?: boolean;
  isRequired: boolean;
  sectionId: string | null;
  response?: any;
  isError: boolean;
  errMessage: string;
};

export type AnswerResponseType = {
  _id: string;
  formId: string;
  questionId: string;
  sectionId: string | null;
  question: string;
  questionType: questionOptTypes;
  // response?: any;
  isRequired: boolean;
  // isError: boolean;
  // errMessage: string;
  options?: string[];
  rowOptions?: string[];
  colOptions?: string[];
  dateOptions?: string;
  allowedDateRange?: boolean;
  allowedTimeRange?: boolean;
  minValue?: number | null;
  minLabel?: string;
  maxValue?: number | null;
  maxLabel?: string;
  hasLimit: boolean;
  description?: string;
  wordLimit?: number | null;
  multiSelectLimit?: boolean;
  maxSelectLimit?: number | null;
};

export type FormAnswerType = {
  questionId: string;
  questionType: questionOptTypes;
  response?: any;
  isError: boolean;
  isRequired: boolean;
  errMessage: string;
};
