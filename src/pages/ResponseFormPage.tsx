/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { axiosFetch } from "../api";
import DefaultLayout from "../components/layouts/DefaultLayout";
import ResponseSelect from "../components/responsetypes/ResponseSelect";
import ResponseShared from "../components/common/ResponseShared";
import { RiHome5Line } from "react-icons/ri";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoArrowForwardOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import {
  updatedAnswerLists,
  updatedCurrSectionInfo,
  updatedFormInfo,
  updatedResponseLists,
} from "../state/form/responseSlice";
import { SectionsPropsType } from "../state/form/formSlice";
import ResponseHeader from "../components/response-form/ResponseHeader";
import InvalidFormNote from "../components/response-form/InvalidFormNote";
import ResponseCompleteNote from "../components/response-form/ResponseCompleteNote";

const ResponseFormPage = ({ mode }: { mode: "preview" | "response" }) => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currSectionId = params.get("sectionId");

  const [countDown, setCountDown] = useState(30);

  const formInfo = useSelector((state: RootState) => state.response.formInfo);
  const answerLists = useSelector(
    (state: RootState) => state.response.answerLists
  );
  const responseLists = useSelector(
    (state: RootState) => state.response.responseLists
  );

  const step = useSelector((state: RootState) => state.response.step);
  // console.log(step);

  const dispatch = useDispatch();
  // checked if user can see/use the form when published
  const [isValid, setIsValid] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [submitToggle, setSubmitToggle] = useState(false);

  const handleSectionStepClick = (type: "prev" | "next") => {
    const idx = type === "prev" ? step.currStep - 1 : step.currStep + 1;
    const section = formInfo.sections[idx];

    const link =
      mode === "response"
        ? `/response/${formId}?sectionId=${section._id}`
        : `/preview/${formId}?sectionId=${section._id}`;
    navigate(link);
    dispatch(updatedCurrSectionInfo(section));
  };

  const handleFormSubmit = async () => {
    const formated_response = responseLists.map((res) => {
      // console.log(res);
      const question = answerLists.find((ans) => ans._id === res.questionId);
      let response: any;
      switch (res.questionType) {
        case "shortAnswer":
        case "paragraph":
        case "multiChoice":
        case "linearScale":
          response = res.response;
          break;
        case "dropdown":
          if (Array.isArray(res.response)) {
            response = res.response
              .map((data: { label: string; value: any }) => data.value)
              .join(", ");
          } else if (res.response.value) {
            response = res.response.value;
          } else {
            response = "";
          }
          break;
        case "checkboxes":
          response = res.response.join(", ");
          break;
        case "date":
          if (res.response.startDate) {
            response += `- Date: ${res.response.startDate}`;
            if (res.response.endDate) {
              response += ` ~ ${res.response.endDate}\n`;
            }
          }

          if (res.response.startTime) {
            response += `- Time: ${res.response.startTime}`;
            if (res.response.endTime) {
              response += ` ~ ${res.response.endTime}`;
            }
          }
          break;
        case "multiChoiceGrid":
          if (question?.colOptions && res.response) {
            response = Object.entries(res.response)
              .map(([key, value]) => {
                const columnOption = (question?.colOptions as string[])[
                  Number(key)
                ];
                return `- ${columnOption}: ${value}`;
              })
              .join("\n");
          } else {
            response = "";
          }
          break;
        case "checkboxGrid":
          if (question?.colOptions && res.response) {
            response = Object.entries(res.response)
              .map(([key, value]) => {
                const columnOption = (question?.colOptions as string[])[
                  Number(key)
                ];
                const value_join = (value as string[]).join(", ");
                return `- ${columnOption}: ${value_join}`;
              })
              .join("\n");
          } else {
            response = "";
          }
          break;
        default:
          response = "";
          break;
      }

      return {
        formId,
        questionId: res.questionId,
        response,
      };
    });
    if (formated_response.length === 0 || isSubmitDisabled) return;

    try {
      const res = await axiosFetch("POST", `/responses/submit-form`, false, {
        responses: formated_response,
      });

      if (res?.data.success) {
        setSubmitToggle(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mode === "preview") {
      setIsValid(true);
      return;
    }

    if (!formId) return;

    const fetchValidation = async () => {
      try {
        const res = await axiosFetch(
          "GET",
          `/responses/${formId}/validation`,
          false
        );
        if (res?.data.success) {
          setIsValid(res?.data.data);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchValidation();
  }, [formId, mode]);

  useEffect(() => {
    if (!formId || (mode === "response" && !isValid)) return;
    const fetchFormInfo = async () => {
      try {
        const res = await axiosFetch("GET", `/responses/${formId}/form`, false);
        if (res?.data.success) {
          const { form, questions } = res?.data.data || {};

          const sections = form.sections.sort(
            (a: SectionsPropsType, b: SectionsPropsType) => a.order - b.order
          );
          dispatch(
            updatedFormInfo({
              id: form._id,
              title: form.title,
              description: form.description,
              isPublished: form.isPublished,
              hasSections: form.hasSections,
              sections: sections,
              message: form.message,
            })
          );
          dispatch(updatedResponseLists(questions));
          if (form.hasSections && !currSectionId) {
            const link =
              mode === "response"
                ? `/response/${formId}?sectionId=${form.sections[0]._id}`
                : `/preview/${formId}?sectionId=${form.sections[0]._id}`;
            navigate(link);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFormInfo();
  }, [formId, mode, isValid]);

  useEffect(() => {
    if (!currSectionId) return;
    const section = formInfo.sections.find((sec) => sec._id === currSectionId);
    if (section) dispatch(updatedCurrSectionInfo(section));
  }, [currSectionId, formInfo.sections]);

  useEffect(() => {
    if (!formId) return;

    const url = currSectionId
      ? `/responses/${formId}/questions?sectionId=${currSectionId}`
      : `/responses/${formId}/questions`;

    const fetchFormQuestions = async () => {
      try {
        const res = await axiosFetch("GET", url, false);
        if (res?.data.success) {
          const question = res?.data.data;

          dispatch(updatedAnswerLists(question));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFormQuestions();
  }, [formId, currSectionId]);

  useEffect(() => {
    const is_required_empty = responseLists.some((answer) => {
      if (!answer.isRequired) return false; // Skip if not required

      const { response, questionType } = answer;

      switch (questionType) {
        case "shortAnswer":
        case "paragraph":
          return response.trim() === ""; // Empty string

        case "dropdown":
        case "multiChoice":
        case "linearScale":
          return response === null; // Unselected single choice

        case "checkboxes":
          return Array.isArray(response) && response.length === 0; // No selections

        case "multiChoiceGrid":
          return Object.values(response).some((val) => val === ""); // Empty cell

        case "checkboxGrid":
          return Object.values(response).every(
            (val) => Array.isArray(val) && val.length === 0
          ); // No checked boxes in any row

        case "date":
          return (
            response.startDate === null &&
            response.endDate === null &&
            response.startTime === null &&
            response.endTime === null
          ); // No date/time set

        default:
          return false; // Other question types
      }
    });

    const has_error = responseLists.some((answer) => answer.isError);

    setIsSubmitDisabled(is_required_empty || has_error);
  }, [responseLists]);

  useEffect(() => {
    if (mode === "preview") return;
    if (submitToggle) {
      setCountDown(30);
      const timer = setInterval(() => {
        setCountDown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [submitToggle, mode]);

  if (!isValid) return <InvalidFormNote />;

  return (
    <>
      <DefaultLayout
        title={`${mode === "preview" ? "PREVIEW" : "RESPONSE"} FORM`}
      >
        {/* SHARED AREA */}
        {mode === "response" && <ResponseShared />}
        {mode === "preview" && (
          <>
            <Link
              to="/"
              className="px-4 py-2 rounded-md flex items-center gap-2 border border-sun text-sun w-fit hover:border-hot hover:text-hot"
            >
              <RiHome5Line />
              <p>Back to Home</p>
            </Link>
            <p className="w-full bg-sun text-hot text-sm px-2 py-1.5">
              Preview status. This form isn't accepting responses.
            </p>
          </>
        )}

        <div className="flex flex-col gap-4">
          <ResponseHeader />
          <div className="flex flex-col gap-2">
            {answerLists.map((item, index) => {
              const curr_response = responseLists.find(
                (res) => res.questionId === item._id
              );
              if (!curr_response) return;
              const { response, isError, errMessage } = curr_response;
              return (
                <ResponseSelect
                  {...item}
                  response={response}
                  isError={isError}
                  errMessage={errMessage}
                  key={`answer-${index}`}
                />
              );
            })}
          </div>

          <div
            className={`flex items-center ${
              formInfo.hasSections ? "justify-between" : "justify-end"
            }`}
          >
            {formInfo.hasSections && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={step.currStep === 0}
                  className="flex items-center gap-1 cursor-pointer bg-violet text-midnight rounded-md px-4 py-2 disabled:cursor-default disabled:bg-slate-200 disabled:text-white"
                  id="prev"
                  onClick={() => handleSectionStepClick("prev")}
                >
                  <IoArrowBackOutline />
                  <p>Prev</p>
                </button>
                <button
                  disabled={step.isLastStep}
                  className="flex items-center gap-1 cursor-pointer bg-violet text-midnight rounded-md px-4 py-2 disabled:cursor-default disabled:bg-slate-200 disabled:text-white"
                  id="next"
                  onClick={() => handleSectionStepClick("next")}
                >
                  <p>Next</p>
                  <IoArrowForwardOutline />
                </button>
              </div>
            )}

            {mode === "response" && (
              <button
                // disabled={isSubmitDisabled}
                onClick={handleFormSubmit}
                className="cursor-pointer bg-midnight text-white rounded-md px-4 py-2 hover:shadow-md disabled:bg-slate-200"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </DefaultLayout>
      {submitToggle && <ResponseCompleteNote countDown={countDown} />}
      {/* <ResponseCompleteNote countDown={countDown} /> */}
    </>
  );
};

export default ResponseFormPage;
