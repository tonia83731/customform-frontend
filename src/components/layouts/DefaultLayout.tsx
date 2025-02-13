import { ReactNode } from "react";
import { PiSignOutBold } from "react-icons/pi";
import { useNavigate } from "react-router";

const DefaultLayout = ({
  children,
  title,
  allowedSignout = false,
}: {
  children: ReactNode;
  title: string;
  allowedSignout?: boolean;
}) => {
  const navigate = useNavigate();
  const handleSignout = () => {
    localStorage.removeItem("authToken");
    navigate("/signin");
  };
  return (
    <div className="w-full h-full min-h-screen bg-daylight relative">
      <div className="container max-w-[1280px] mx-auto py-[40px] px-[20px] flex flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="font-bold text-3xl">{title}</h1>
          {allowedSignout && (
            <button
              onClick={handleSignout}
              className="text-sun hover:text-hot text-xl cursor-pointer"
            >
              <PiSignOutBold />
            </button>
          )}
        </div>
        <main className="flex flex-col gap-6">{children}</main>
      </div>
    </div>
  );
};

export default DefaultLayout;
