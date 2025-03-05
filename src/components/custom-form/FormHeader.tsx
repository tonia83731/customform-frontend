import { useDispatch, useSelector } from "react-redux";
import QuestionLayout from "../layouts/QuestionLayout";
import { RootState } from "../../state/store";
import { useParams } from "react-router";
import {
  FormInfoPropsType,
  onFormInfoChange,
  setFormInfo,
} from "../../state/form/formSlice";
import { axiosFetch } from "../../api";
import { ChangeEvent } from "react";

const FormHeader = () => {
  const { formId } = useParams();
  const formInfo = useSelector((state: RootState) => state.form.formInfo);
  const dispatch = useDispatch();
  const handleFormInfoChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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
  return (
    <QuestionLayout>
      <input
        type="text"
        placeholder="FORM TITLE"
        className="h-10 text-lg font-bold text-midnight placeholder:text-violet focus:border-b focus:border-midnight focus:px-4"
        name="title"
        value={formInfo.title}
        onChange={handleFormInfoChange}
        onBlur={handleFormInfoBlur}
      />
      <textarea
        placeholder="FORM DESCRIPTION"
        className="text-sm resize-y text-midnight placeholder:text-violet focus:border-b focus:border-midnight focus:px-4"
        name="description"
        rows={3}
        value={formInfo.description}
        onChange={handleFormInfoChange}
        onBlur={handleFormInfoBlur}
      ></textarea>
    </QuestionLayout>
  );
};

export default FormHeader;
