import { useSelector } from "react-redux";
import { RootState } from "../../state/store";
import QuestionLayout from "../layouts/QuestionLayout";

const ResponseHeader = () => {
  const formInfo = useSelector((state: RootState) => state.response.formInfo);
  const currSectionInfo = useSelector(
    (state: RootState) => state.response.currSectionInfo
  );
  return (
    <>
      <QuestionLayout colorClass="bg-midnight text-white py-2">
        <h1 className="font-bold text-2xl">{formInfo.title}</h1>
        <h5 className="opacity-85 whitespace-pre-wrap">
          {formInfo.description}
        </h5>
      </QuestionLayout>
      {formInfo.hasSections && (
        <QuestionLayout>
          <h1 className="font-bold text-xl border-b border-violet border-dotted py-1.5">
            {currSectionInfo?.title}
          </h1>
          <h5 className="opacity-85 whitespace-pre-wrap">
            {currSectionInfo?.description}
          </h5>
        </QuestionLayout>
      )}
    </>
  );
};

export default ResponseHeader;
