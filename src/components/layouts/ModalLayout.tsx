import { ReactNode } from "react";
import { RxCross2 } from "react-icons/rx";

const ModalLayout = ({
  hasHeader = false,
  title = "",
  children,
  footerChildren,
  classWidth = "w-[90%] max-w-[600px]",
  onCloseClick,
}: {
  hasHeader?: boolean;
  title?: string;
  children: ReactNode;
  footerChildren?: ReactNode;
  classWidth?: string;
  onCloseClick?: () => void;
}) => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-midnight-60">
      <div className="w-full h-full flex justify-center items-center">
        <div className={`bg-white text-midnight rounded-lg ${classWidth}`}>
          {hasHeader && (
            <header className="px-4 py-1.5 flex justify-between items-center border-b border-violet">
              <div className="font-bold text-lg">{title}</div>
              <button
                className="opacity-75 hover:opacity-100"
                onClick={onCloseClick}
              >
                <RxCross2 />
              </button>
            </header>
          )}
          <div className="px-8 py-6 flex flex-col gap-4">{children}</div>
          {footerChildren}
        </div>
      </div>
    </div>
  );
};

export default ModalLayout;
