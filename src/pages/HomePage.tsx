/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import DefaultLayout from "../components/layouts/DefaultLayout";
import ModalLayout from "../components/layouts/ModalLayout";
import { IoCreateOutline } from "react-icons/io5";
import { FaWpforms } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { AiOutlineDatabase } from "react-icons/ai";
import { FaLink } from "react-icons/fa6";
import { axiosFetch } from "../api";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import {
  addForm,
  deleteForm,
  initializedFormLists,
} from "../state/form/mainSlice";

const HomePage = () => {
  const formLists = useSelector((state: RootState) => state.main.formLists);
  const dispatch = useDispatch();

  const [modalToggle, setModalToggle] = useState(false);
  const titleRef = useRef<any>("");
  const descriptionRef = useRef<any>("");

  const handleModalOpened = () => {
    setModalToggle(true);
  };
  const handleModalCanceled = () => {
    if (titleRef.current) titleRef.current.value = "";
    if (descriptionRef.current) descriptionRef.current.value = "";
    setModalToggle(false);
  };
  const handleModalConfirmed = async () => {
    try {
      const title = titleRef.current.value;
      const description = descriptionRef.current.value;

      const res = await axiosFetch("POST", "/forms/create-form", true, {
        title,
        description,
      });

      if (!res?.data.success) return;

      const form = res?.data.data;
      dispatch(addForm(form));
      handleModalCanceled();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFormDelete = async (id: string) => {
    try {
      const res = await axiosFetch("DELETE", `/forms/${id}/delete-form`, true);
      if (res?.data.success) {
        dispatch(deleteForm(id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatedEditTime = (date: string) => {
    const now = dayjs();
    const givenDate = dayjs(date);

    return givenDate.isSame(now, "day")
      ? `Today ${givenDate.format("HH:mm")}`
      : givenDate.format("YYYY-MM-DD HH:mm");
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const res = await axiosFetch("GET", "/forms", true);
        if (res?.data.success) {
          const forms = res?.data.data;
          dispatch(initializedFormLists(forms));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchForms();
  }, []);

  return (
    <DefaultLayout title="CUSTOM FORMS" allowedSignout={true}>
      <button
        onClick={handleModalOpened}
        className="cursor-pointer px-4 py-2 rounded-md flex items-center gap-2 border border-sun text-sun w-fit hover:border-hot hover:text-hot"
      >
        <IoCreateOutline />
        <p>Create Forms</p>
      </button>
      <div className="">
        {formLists.length < 0 ? (
          <div className="text-slate-400 text-center text-sm">
            No form exists yet. Get started by{" "}
            <span className="text-violet">
              <button
                onClick={handleModalOpened}
                className="cursor-pointer hover:underline hover:underline-offset-2"
              >
                creating
              </button>
            </span>{" "}
            one now!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
            {formLists.map(
              ({ _id, title, lastEditAt, description, isPublished }) => {
                return (
                  <div
                    className="bg-white w-full h-full p-4 rounded-md flex flex-col justify-between gap-4 shadow-md"
                    key={_id}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between items-center gap-4">
                        <Link
                          to={`/updated-form/${_id}`}
                          className="flex items-center gap-2"
                        >
                          <FaWpforms />
                          <h5 className="font-semibold">{title}</h5>
                        </Link>
                        <Link
                          to={`/response/${_id}/results`}
                          className="text-midnight"
                        >
                          <AiOutlineDatabase />
                        </Link>
                      </div>
                      <p className="text-xs text-violet line-clamp-2">
                        {description}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="inline-flex text-midnight ">
                        <p className="text-xs">
                          最後更新: {formatedEditTime(lastEditAt)},{" "}
                          {isPublished ? "已公開" : "未公開"}{" "}
                        </p>
                        {isPublished && (
                          <Link
                            to={`/response/${_id}`}
                            target="_blank"
                            className="cursor-pointer pl-1 h-full text-base"
                          >
                            <FaLink />
                          </Link>
                        )}
                      </div>
                      <button
                        onClick={() => handleFormDelete(_id)}
                        className="cursor-pointer text-violet hover:text-midnight"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
      {modalToggle && (
        <ModalLayout
          hasHeader={true}
          title="CREATE FORM"
          footerChildren={
            <div className="text-white grid grid-cols-2">
              <button
                onClick={handleModalCanceled}
                className="bg-slate-200 px-4 py-2 cursor-pointer"
              >
                CANCELED
              </button>
              <button
                onClick={handleModalConfirmed}
                className="bg-midnight px-4 py-2 cursor-pointer"
              >
                CREATE
              </button>
            </div>
          }
          onCloseClick={handleModalCanceled}
        >
          <input
            ref={titleRef}
            type="text"
            placeholder="TITLE"
            className="bg-slate-50 w-full h-10 px-2 font-bold text-midnight placeholder:text-slate-200 focus:border-b focus:border-midnight focus:px-4"
          />
          <input
            ref={descriptionRef}
            type="text"
            placeholder="DESCRIPTION"
            className="bg-slate-50 w-full h-8 px-2 text-xs text-midnight placeholder:text-slate-200 focus:border-b focus:border-midnight focus:px-4"
          />
        </ModalLayout>
      )}
    </DefaultLayout>
  );
};

export default HomePage;
