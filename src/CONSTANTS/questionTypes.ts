import { MdOutlineShortText } from "react-icons/md";
import { ImParagraphLeft } from "react-icons/im";
import { RiCheckboxMultipleLine } from "react-icons/ri";
import { RxDropdownMenu } from "react-icons/rx";
import { IoMdCheckboxOutline } from "react-icons/io";
import { MdOutlineLinearScale } from "react-icons/md";
import { BsCalendar2Date } from "react-icons/bs";
import { BsUiRadiosGrid } from "react-icons/bs";
import { BsUiChecksGrid } from "react-icons/bs";
export type QuestionPropsType = {
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
  order: number;
  sectionId: string | null;
};

export type questionOptTypes =
  | "shortAnswer"
  | "paragraph"
  | "multiChoice"
  | "dropdown"
  | "checkboxes"
  | "linearScale"
  | "date"
  | "multiChoiceGrid"
  | "checkboxGrid";

export const questionType = [
  {
    id: "shortAnswer",
    title: "Short Answer",
    icon: MdOutlineShortText,
    note: "A brief text input for short responses.",
  },
  {
    id: "paragraph",
    title: "Paragraph",
    icon: ImParagraphLeft,
    note: "A longer text input for detailed answers.",
  },
  {
    id: "multiChoice",
    title: "Multi Choice",
    icon: RiCheckboxMultipleLine,
    note: "Choose one option from a list of predefined choices.",
  },
  {
    id: "dropdown",
    title: "Dropdown",
    icon: RxDropdownMenu,
    note: "Select one option from a dropdown menu.",
  },
  {
    id: "checkboxes",
    title: "Checkboxes",
    icon: IoMdCheckboxOutline,
    note: "Select multiple options from a list.",
  },
  {
    id: "linearScale",
    title: "Linear Scale",
    icon: MdOutlineLinearScale,
    note: "Rate something on a scale, e.g., 1 to 10.",
  },
  {
    id: "date",
    title: "Date And Time",
    icon: BsCalendar2Date,
    note: "Pick a date or time from the calendar.",
  },
  {
    id: "multiChoiceGrid",
    title: "MultiChoice Grid",
    icon: BsUiRadiosGrid,
    note: "Select one option per row in a grid format.",
  },
  {
    id: "checkboxGrid",
    title: "Checkbox Grid",
    icon: BsUiChecksGrid,
    note: "Select multiple options per row in a grid format.",
  },
];
