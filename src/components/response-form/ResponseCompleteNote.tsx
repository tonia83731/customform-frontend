import { FaCheck } from "react-icons/fa";
import ResponseShared from "../common/ResponseShared";
import { RootState } from "../../state/store";
import { useSelector } from "react-redux";
import ModalLayout from "../layouts/ModalLayout";

const ResponseCompleteNote = ({ countDown }: { countDown: number }) => {
  const formInfo = useSelector((state: RootState) => state.response.formInfo);
  return (
    <ModalLayout>
      <div className="flex flex-col justify-center items-center gap-2">
        <div className="w-10 h-10 border-5 border-grass rounded-full text-grass flex justify-center items-center text-xl">
          <FaCheck />
        </div>
        <h1 className="font-bold text-xl md:text-2xl">
          Form submitted successfully
        </h1>
      </div>
      <p className="text-center">{formInfo.message}</p>
      <div className="flex flex-col gap-1 items-center">
        <h5 className="text-hot">Kindly share the link if possible.</h5>
        <ResponseShared />
      </div>
      {/* <p className="text-dark opacity-75 text-center text-xs">
        Otherwise, you may close the window.
      </p> */}
      <p className="text-dark opacity-75 text-center text-xs">
        The window will refresh after{" "}
        <span className="text-hot">{countDown}</span> second...
      </p>
    </ModalLayout>
  );
};

export default ResponseCompleteNote;
