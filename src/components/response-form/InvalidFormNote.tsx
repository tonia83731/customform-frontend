import { IoWarningOutline } from "react-icons/io5";
import { Link } from "react-router";

const InvalidFormNote = () => {
  return (
    <div className="w-full h-full min-h-screen bg-daylight relative">
      <div className="w-full h-full min-h-screen flex justify-center items-center">
        <div className="w-[90%] h-full max-w-[900px] p-4 flex flex-col gap-6 bg-white text-midnight rounded-lg shadow-md">
          <div className="font-bold text-2xl flex items-center gap-4">
            <IoWarningOutline className="text-hot" />
            <h3>Form Unavailable</h3>
          </div>
          <p>
            The current form you are attempting to access is not valid. It may
            have been unpublished or deleted. For further assistance, please log
            in to your account or contact our service team.
          </p>
          <div className="w-full flex justify-end">
            <div className="w-full md:w-1/2 flex flex-col md:flex-row md:items-center md:justify-end gap-2">
              <Link
                className="bg-hot text-white px-4 py-1.5 text-center rounded-md hover:shadow cursor-pointer"
                to="mailto:service.team@example.com"
              >
                Contact Service Team
              </Link>
              <Link
                className="bg-midnight text-white px-4 py-1.5  text-center rounded-md hover:shadow cursor-pointer"
                to="/"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvalidFormNote;
