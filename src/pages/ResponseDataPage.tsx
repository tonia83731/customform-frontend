/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useParams } from "react-router";
import DefaultLayout from "../components/layouts/DefaultLayout";
import { RiHome5Line } from "react-icons/ri";
import { useEffect, useRef } from "react";
import { axiosFetch } from "../api";
import ResponseTable from "../components/common/ResponseTable";
import { useDispatch, useSelector } from "react-redux";
import {
  updatedAnswerData,
  updatedFormInfo,
  updatedQuestionData,
} from "../state/form/dataSlice";
import { RootState } from "../state/store";
import { DownloadTableExcel } from "react-export-table-to-excel";
import { PiEmpty } from "react-icons/pi";

const ResponseDataPage = () => {
  const { formId } = useParams();
  const dispatch = useDispatch();
  const tableRef = useRef<HTMLTableElement | null>(null);
  const formInfo = useSelector((state: RootState) => state.data.formInfo);
  const questionData = useSelector(
    (state: RootState) => state.data.questionData
  );
  const answerData = useSelector((state: RootState) => state.data.answerData);

  useEffect(() => {
    const fetchResponseData = async () => {
      const res = await axiosFetch("GET", `/forms/${formId}/responses`, true);
      if (res?.data.success) {
        const { form, questions, responses } = res?.data.data || {};

        dispatch(updatedFormInfo(form));
        dispatch(updatedQuestionData(questions));

        const formated_response = responses.map((item: any, index: number) => ({
          ...item,
          rank: index + 1,
        }));
        dispatch(updatedAnswerData(formated_response));
      }
    };
    fetchResponseData();
  }, []);

  return (
    <DefaultLayout title="RESPONSE DATA" allowedSignout={true}>
      <Link
        to="/"
        className="px-4 py-2 rounded-md flex items-center gap-2 border border-sun text-sun w-fit hover:border-hot hover:text-hot"
      >
        <RiHome5Line />
        <p>Back to Home</p>
      </Link>
      <div className="flex flex-col gap-8">
        <div className="text-midnight flex flex-col gap-4 bg-white rounded-md px-6 py-2 shadow-md">
          <h1 className="font-bold text-xl md:text-2xl">{formInfo.title}</h1>
          <p className="text-sm whitespace-pre-wrap">{formInfo.description}</p>
        </div>
        {/* OUTPUT TO EXCEL */}
        <div className="flex flex-col gap-4">
          <DownloadTableExcel
            filename={formInfo.title}
            sheet="results"
            currentTableRef={tableRef.current}
          >
            <button
              disabled={answerData.length <= 0}
              className="w-fit border border-hot text-hot disabled:border-slate-200 disabled:text-slate-200 disabled:cursor-default disabled:hover:border disabled:hover:border-slate-200 disabled:hover:bg-transparent disabled:hover:text-slate-200 rounded-md px-4 py-1.5 hover:border-0 hover:bg-hot hover:text-white cursor-pointer"
            >
              Export
            </button>
          </DownloadTableExcel>
          {answerData.length <= 0 && (
            <div className="w-full flex items-center gap-2 bg-sun text-hot text-sm px-2 py-1.5">
              <PiEmpty className="text-lg" />
              <p>Currently no data, export unavalilable.</p>
            </div>
          )}
          <div className="w-full max-w-[1280px] overflow-x-auto custom-scroll-x">
            <ResponseTable
              ref={tableRef}
              questions={questionData}
              answers={answerData}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ResponseDataPage;
