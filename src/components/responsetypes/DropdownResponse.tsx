import { useDispatch } from "react-redux";
import Select from "react-select";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";
import { useEffect, useState } from "react";

type ReactSelectType = {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
};

type DropdownResponseProps = {
  id: string;
  options: string[];
  response: ReactSelectType[];
  hasLimit: boolean;
  multiSelectLimit?: boolean;
  maxSelectLimit?: number | null;
  isRequired: boolean;
};

const handleFormatedSelect = (options: string[]) => {
  return options.map((opt) => {
    return {
      label: opt,
      value: opt,
    };
  });
};

const DropdownResponse = ({
  id,
  options,
  response,
  isRequired,
  hasLimit,
  multiSelectLimit,
  maxSelectLimit,
}: DropdownResponseProps) => {
  const dispatch = useDispatch();
  const formated_opt = handleFormatedSelect(options);
  const [initialized, setInitialized] = useState(true);

  useEffect(() => {
    setInitialized(true);
    dispatch(
      updatedQuestionError({
        id,
        isError: false,
        errMessage: "",
      })
    );
  }, []);

  useEffect(() => {
    if (initialized) return;
    if (
      (isRequired && multiSelectLimit && response.length === 0) ||
      (isRequired && !response)
    ) {
      dispatch(
        updatedQuestionError({
          id,
          isError: true,
          errMessage: "This field is required",
        })
      );
    }
  }, [isRequired, response, initialized]);

  return (
    <>
      <Select
        isClearable={true}
        id={id}
        options={formated_opt}
        value={response}
        onChange={(newValue) => {
          setInitialized(false);
          const newValueLength = Array.isArray(newValue) ? newValue.length : 0;
          if (
            hasLimit &&
            multiSelectLimit &&
            maxSelectLimit &&
            newValue &&
            maxSelectLimit < newValueLength
          ) {
            dispatch(
              updatedQuestionError({
                id,
                isError: true,
                errMessage: "Select number exceed",
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

          dispatch(
            addQuestionResponse({
              id,
              response: newValue,
            })
          );
        }}
        isMulti={hasLimit && multiSelectLimit}
        placeholder="Select Answer"
        styles={{
          control: (styles, state) => ({
            ...styles,
            backgroundColor: "white",
            height: "2.5rem",
            width: "100%",
            overflow: "scroll",
            border: "none",
            borderRadius: "0",
            borderBottom: state.isFocused
              ? "0.5px solid #504e76"
              : "0.5px solid #e5e7eb",
            marginLeft: "0",
            paddingLeft: state.isFocused ? "0.25rem" : "0",
            "&:hover": {
              borderBottom: state.isFocused
                ? "0.5px solid #504e76"
                : "0.5px solid #e5e7eb",
            },
            "&:active": {
              borderBottom: "0.5px solid #504e76",
            },
            "&::-webkit-scrollbar": {
              width: 0, // 设置滚动条宽度
              height: 0,
            },
            caretColor: "transparent",
            boxShadow: "none",
          }),
          placeholder: (styles) => ({
            ...styles,
            color: "#B0B0B0",
            marginLeft: "0",
            fontSize: "0.875rem",
          }),
          singleValue: (styles) => ({
            ...styles,
            paddingLeft: "0",
            marginLeft: "0",
          }),
          multiValue: (styles) => ({
            ...styles,
            paddingLeft: "0",
            marginLeft: "0",
            backgroundColor: "#a3b565",
          }),
          multiValueRemove: (styles) => ({
            ...styles,
            "&:hover": {
              backgroundColor: "#a3b565",
              color: "white",
            },
            cursor: "pointer",
          }),
          indicatorSeparator: (styles) => ({
            ...styles,
            display: "none",
          }),
        }}
      />
    </>
  );
};

export default DropdownResponse;
