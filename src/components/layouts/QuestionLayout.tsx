import { ReactNode } from "react";

const QuestionLayout = ({
  children,
  colorClass = "bg-white text-midnight",
}: {
  children?: ReactNode;
  colorClass?: string;
}) => {
  return (
    <div className={`w-full rounded-md ${colorClass} shadow-md`}>
      <div className="px-6 py-2 flex flex-col gap-2">{children}</div>
    </div>
  );
};

export default QuestionLayout;
