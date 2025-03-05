import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../state/store";
import { useNavigate, useParams } from "react-router";
import { axiosFetch } from "../../api";
import {
  SectionsPropsType,
  setFormInfo,
  updatedCurrSectionInfo,
  updatedFormInfo,
  updatedFormSectionData,
  updatedQuestionLists,
} from "../../state/form/formSlice";
import { ChangeEvent, useState } from "react";
import { TbNewSection } from "react-icons/tb";
import { FaThList } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import ModalLayout from "../layouts/ModalLayout";

const FormSections = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const formInfo = useSelector((state: RootState) => state.form.formInfo);
  const currSectionInfo = useSelector(
    (state: RootState) => state.form.currSectionInfo
  );
  const dispatch = useDispatch();

  const [modalToggle, setModalToggle] = useState(false);

  const handleIncludeSection = async () => {
    const method = formInfo.hasSections ? "DELETE" : "POST";
    const url = formInfo.hasSections
      ? `/forms/${formId}/exclude-section`
      : `/forms/${formId}/include-section`;
    try {
      const res = await axiosFetch(method, url);

      if (res?.data.success) {
        const { form, questions } = res?.data.data || {};
        form.sections.sort(
          (a: SectionsPropsType, b: SectionsPropsType) => a.order - b.order
        );
        dispatch(updatedFormInfo(form));
        dispatch(
          updatedCurrSectionInfo(form.hasSections ? form.sections[0] : null)
        );
        dispatch(updatedQuestionLists(questions));
        const link = form.hasSections
          ? `/updated-form/${formId}?sectionId=${form.sections[0]._id}`
          : `/updated-form/${formId}`;
        navigate(link);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAddSection = async () => {
    try {
      const res = await axiosFetch("POST", `/forms/${formId}/add-section`);
      if (res?.data.success) {
        const sections = res?.data.data;
        dispatch(setFormInfo({ sections }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await axiosFetch(
        "DELETE",
        `/forms/${formId}/${sectionId}/deleted-section`
      );

      if (res?.data.success) {
        const sections = res?.data.data;

        dispatch(setFormInfo({ sections }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSectionInfoChange = (
    e: ChangeEvent<HTMLInputElement>,
    sectionId: string
  ) => {
    const value = e.target.value;

    const updated_sections = formInfo.sections.map((section) => {
      return section._id === sectionId ? { ...section, title: value } : section;
    });

    dispatch(
      updatedFormSectionData({
        sections: updated_sections,
      })
    );
  };

  const handleSectionInfoBlur = async (sectionId: string) => {
    const section = formInfo.sections.find(
      (section) => section._id === sectionId
    );
    if (!section) return;
    const body = {
      title: section.title,
      description: section.description,
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
        dispatch(setFormInfo({ sections }));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSectionSelect = async (section: SectionsPropsType) => {
    navigate(`/updated-form/${formId}?sectionId=${section._id}`);
    dispatch(updatedCurrSectionInfo(section));

    try {
      const res = await axiosFetch(
        "GET",
        `/forms/${formId}/get-form-questions?sectionId=${section._id}`
      );

      if (res?.data.success) {
        const questions = res?.data.data;
        // console.log(questions);
        dispatch(updatedQuestionLists(questions));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="flex items-center gap-4 w-full overflow-x-auto custom-scroll-x overflow-y-hidden">
        <div className="flex items-center gap-2">
          <label
            htmlFor="has-section"
            className={`${
              formInfo.hasSections
                ? "bg-hot text-white"
                : "border border-hot text-hot"
            } rounded-md px-2 cursor-pointer h-7 leading-7 truncate`}
          >
            <input
              type="checkbox"
              id="has-section"
              className="hidden"
              checked={
                formInfo.hasSections !== undefined
                  ? formInfo.hasSections
                  : false
              }
              onChange={handleIncludeSection}
            />
            {formInfo.hasSections ? "Exclude Section" : "Include Section"}
          </label>
          <button
            disabled={!formInfo.hasSections}
            onClick={() => setModalToggle(!modalToggle)}
            className="bg-hot text-white rounded-md px-2 h-7 leading-7 cursor-pointer disabled:bg-slate-200 disabled:cursor-default"
          >
            <FaThList />
          </button>
        </div>
        {formInfo.hasSections && (
          <>
            {formInfo.sections.map((section: SectionsPropsType) => {
              return (
                <button
                  key={section._id}
                  disabled={
                    currSectionInfo && currSectionInfo._id === section._id
                      ? true
                      : false
                  }
                  onClick={() => handleSectionSelect(section)}
                  className={`${
                    currSectionInfo && currSectionInfo._id === section._id
                      ? "bg-midnight text-white font-bold"
                      : "bg-violet text-midnight"
                  } rounded-md px-2 py-0.5 cursor-pointer hover:shadow-lg disabled:shadow-none whitespace-nowrap`}
                >
                  {section.title}
                </button>
              );
            })}
            <button
              className="text-3xl text-sun hover:text-hot cursor-pointer"
              title="Add Section"
              onClick={handleAddSection}
            >
              <TbNewSection />
            </button>
          </>
        )}
      </div>
      {modalToggle && (
        <ModalLayout
          hasHeader={true}
          title="ORGANIZED SECTION"
          onCloseClick={() => setModalToggle(false)}
          footerChildren={
            <button
              onClick={() => setModalToggle(false)}
              className="w-full bg-midnight text-white px-4 py-2 cursor-pointer hover:font-bold"
            >
              CLOSE
            </button>
          }
        >
          <ul>
            {formInfo.sections.map(
              ({ _id, order, title }: SectionsPropsType) => {
                return (
                  <li
                    className={`grid grid-cols-[20px_2fr_20px] gap-2 bg-violet py-1 px-2 ${
                      order !== 0 && "border-t-2 border-white"
                    }`}
                  >
                    <div>{order + 1}.</div>
                    <input
                      type="text"
                      value={title}
                      className="w-full text-sm text-midnight placeholder:text-violet focus:border-b focus:border-midnight focus:px-4"
                      onChange={(e) => handleSectionInfoChange(e, _id)}
                      onBlur={() => handleSectionInfoBlur(_id)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="cursor-pointer hover:text-hot"
                        onClick={() => handleDeleteSection(_id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </li>
                );
              }
            )}
          </ul>
        </ModalLayout>
      )}
    </>
  );
};

export default FormSections;
