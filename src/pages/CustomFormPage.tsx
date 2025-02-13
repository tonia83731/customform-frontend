/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useLocation, useParams } from "react-router";
import { ChangeEvent, useEffect } from "react";
import DefaultLayout from "../components/layouts/DefaultLayout";
import QuestionSelect from "../components/questiontypes/QuestionSelect";
import { RiHome5Line } from "react-icons/ri";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { axiosFetch } from "../api";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import {
  updatedFormInfo,
  updatedCurrSectionInfo,
  updatedQuestionLists,
  SectionsPropsType,
  setFormInfo,
  onSectionInfoChange,
  onFormInfoChange,
  FormInfoPropsType,
} from "../state/form/formSlice";
import { useNavigate } from "react-router";
import QuestionTypeButton from "../components/custom-form/QuestionTypeButton";
import FormSections from "../components/custom-form/FormSections";
import FormHeader from "../components/custom-form/FormHeader";
import QuestionLayout from "../components/layouts/QuestionLayout";

const CustomFormPage = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const currSectionId = params.get("sectionId");

  const formInfo = useSelector((state: RootState) => state.form.formInfo);
  const questionLists = useSelector(
    (state: RootState) => state.form.questionLists
  );
  const focusedQuestionId = useSelector(
    (state: RootState) => state.form.focusedQuestionId
  );
  const currSectionInfo = useSelector(
    (state: RootState) => state.form.currSectionInfo
  );
  const dispatch = useDispatch();

  const handleFormInfoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    dispatch(
      onFormInfoChange({
        name: name as string as keyof FormInfoPropsType,
        value,
      })
    );
  };

  const handleFormInfoBlur = async () => {
    try {
      const res = await axiosFetch("PUT", `/forms/${formId}/edit-form`, true, {
        title: formInfo.title,
        description: formInfo.description,
        message: formInfo.message,
      });
      if (res?.data.success) {
        const { title, description, message } = res?.data.data || {};
        dispatch(setFormInfo({ title, description, message }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSectionInfoChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (!currSectionInfo) return;

    const body = {
      title: currSectionInfo?.title,
      description: e.target.value,
    };
    dispatch(onSectionInfoChange(body));
  };

  const handleSectionInfoBlur = async (sectionId: string) => {
    const body = {
      title: currSectionInfo?.title,
      description: currSectionInfo?.description,
    };
    try {
      const res = await axiosFetch(
        "PUT",
        `/forms/${formId}/${sectionId}/updated-section`,
        true,
        body
      );

      if (res?.data.success) {
        const sections = res?.data.data;
        const section = sections.find(
          (sect: SectionsPropsType) => sect._id === sectionId
        );

        if (section) dispatch(updatedCurrSectionInfo(section));
        dispatch(setFormInfo({ sections }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sensors = useSensors(useSensor(PointerSensor));

  // updated form published
  const handleFormPublished = async () => {
    try {
      const res = await axiosFetch("PATCH", `/forms/${formId}/published`, true);
      if (res?.data.success) {
        dispatch(setFormInfo({ isPublished: !formInfo.isPublished }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ----------------------------------------------
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndx = questionLists.findIndex((q) => q._id === active.id);
    const newIndx = questionLists.findIndex((q) => q._id === over.id);

    const reorder_questions = arrayMove(questionLists, oldIndx, newIndx).map(
      (question, index) => ({
        ...question,
        order: index + 1,
      })
    );

    const changedQuestions = reorder_questions.filter((q) => {
      const originalQuestion = questionLists.find(
        (original) => original._id === q._id
      );
      return originalQuestion?.order !== q.order;
    });

    if (changedQuestions.length === 0) return;

    try {
      const questionOrder = changedQuestions.map(({ _id, order }) => ({
        _id,
        order,
      }));

      const res = await axiosFetch(
        "PATCH",
        `/forms/${formId}/updated-question-order`,
        true,
        {
          sectionId: currSectionId,
          questionOrder,
        }
      );

      if (res?.data.success) {
        const questions = res?.data.data;
        dispatch(updatedQuestionLists(questions));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!formId) return;
    const fetchFormInfo = async () => {
      try {
        const res = await axiosFetch("GET", `/forms/${formId}/get-form`, true);
        if (res?.data.success) {
          const form = res?.data.data || {};

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
          if (form.hasSections && !currSectionId)
            navigate(
              `/updated-form/${formId}?sectionId=${form.sections[0]._id}`
            );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchFormInfo();
  }, [formId]);

  useEffect(() => {
    if (!currSectionId) return;
    const section = formInfo.sections.find((sec) => sec._id === currSectionId);
    if (section) dispatch(updatedCurrSectionInfo(section));
  }, [currSectionId, formInfo.sections]);

  useEffect(() => {
    if (!formId) return;

    const url = currSectionId
      ? `/forms/${formId}/get-form-questions?sectionId=${currSectionId}`
      : `/forms/${formId}/get-form-questions`;

    const fetchFormQuestions = async () => {
      try {
        const res = await axiosFetch("GET", url, true);

        if (res?.data.success) {
          const question = res?.data.data;

          dispatch(updatedQuestionLists(question));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFormQuestions();
  }, [formId, currSectionId]);

  return (
    <>
      <DefaultLayout title="UPDATED FORM" allowedSignout={true}>
        <Link
          to="/"
          className="px-4 py-2 rounded-md flex items-center gap-2 border border-sun text-sun w-fit hover:border-hot hover:text-hot"
        >
          <RiHome5Line />
          <p>Back to Home</p>
        </Link>
        <QuestionTypeButton />
        <FormSections />
        <div className="flex flex-col gap-4">
          <FormHeader />

          {formInfo.hasSections && (
            <div className="w-full bg-white rounded-md shadow-md">
              <div className="bg-midnight text-white text-lg font-bold px-6 py-1 rounded-t-md">
                {currSectionInfo?.title}
              </div>
              <div className="px-6 py-2">
                <textarea
                  placeholder="SECTION DESCRIPTION"
                  className="w-full text-sm resize-y text-midnight placeholder:text-violet focus:border-b focus:border-midnight focus:px-4"
                  rows={3}
                  value={currSectionInfo?.description || ""}
                  onChange={(e) => handleSectionInfoChange(e)}
                  onBlur={() =>
                    handleSectionInfoBlur(currSectionInfo?._id as string)
                  }
                ></textarea>
              </div>
            </div>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={questionLists.map((q) => q._id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col gap-2">
                {questionLists.map((item, index) => (
                  <QuestionSelect {...item} key={`question-${index}`} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {(!formInfo.hasSections ||
          (formInfo.hasSections &&
            formInfo.sections[formInfo.sections.length - 1]._id ===
              currSectionId)) && (
          <QuestionLayout>
            <textarea
              placeholder="THANKYOU MESSAGE"
              className="text-sm resize-y text-midnight placeholder:text-violet focus:border-b focus:border-midnight focus:px-4"
              name="message"
              rows={2}
              value={formInfo.message}
              onChange={handleFormInfoChange}
              onBlur={handleFormInfoBlur}
            ></textarea>
          </QuestionLayout>
        )}

        <div className="flex justify-end">
          <div className="grid grid-cols-2 gap-4">
            {questionLists.length > 0 && focusedQuestionId === null ? (
              <Link
                to={`/preview/${formInfo.id}`}
                target="_blank"
                className="cursor-pointer text-center bg-grass text-white rounded-md px-4 py-2 hover:shadow-md"
              >
                Preview
              </Link>
            ) : (
              <button
                disabled
                className="cursor-not-allowed text-center bg-slate-200 text-white rounded-md px-4 py-2"
              >
                Preview
              </button>
            )}
            <button
              onClick={handleFormPublished}
              disabled={questionLists.length <= 0}
              className={`cursor-pointer ${
                formInfo.isPublished ? "bg-hot" : "bg-midnight"
              } text-white rounded-md px-4 py-2 hover:shadow-md disabled:bg-slate-200`}
            >
              {formInfo.isPublished ? "Unpublished" : "Published"}
            </button>
          </div>
        </div>
      </DefaultLayout>
    </>
  );
};

export default CustomFormPage;
