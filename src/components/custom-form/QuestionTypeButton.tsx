import { useLocation, useParams } from "react-router";
import { questionOptTypes, questionType } from "../../CONSTANTS/questionTypes";
import { axiosFetch } from "../../api";
import { useDispatch } from "react-redux";
import { addQuestion } from "../../state/form/formSlice";

const QuestionTypeButton = () => {
  const { formId } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currSectionId = params.get("sectionId");
  const dispatch = useDispatch();

  const handleAddQuestion = async (questionType: questionOptTypes) => {
    try {
      const body = {
        questionType,
        sectionId: currSectionId || null,
      };
      // console.log(body);
      const res = await axiosFetch(
        "POST",
        `/forms/${formId}/add-question`,
        true,
        body
      );

      if (res?.data.success) {
        const question = res?.data.data;
        dispatch(addQuestion(question));
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {questionType.map(({ id, title, icon: Icon, note }) => (
        <button
          onClick={() => handleAddQuestion(id as questionOptTypes)}
          className="flex justify-center items-center gap-1.5 py-2 rounded-md bg-white shadow-md hover:bg-sun cursor-pointer"
          key={id}
          title={note}
        >
          <div className="">
            <Icon />
          </div>
          <h5 className="">{title}</h5>
        </button>
      ))}
    </div>
  );
};

export default QuestionTypeButton;
