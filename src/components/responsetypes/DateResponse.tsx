import dayjs from "dayjs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { IoTimeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";
import { useEffect, useState } from "react";

const DateResponse = ({
  id,
  dateOptions,
  response,
  allowedDateRange,
  allowedTimeRange,
  isRequired,
}: {
  id: string;
  dateOptions: string;
  allowedDateRange: boolean;
  allowedTimeRange: boolean;
  response: {
    startDate: string | null;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
  };
  isRequired: boolean;
}) => {
  const [initialized, setInitialized] = useState(true);
  const dispatch = useDispatch();
  const showedDate = dateOptions === "date" || dateOptions === "both";
  const showedTime = dateOptions === "time" || dateOptions === "both";

  // const d1 = dayjs.tz("2013-11-18 11:55", "Asia/Taipei");
  // d1.format(); // => 2013-11-18T11:55:00+08:00

  const today = dayjs(new Date()).format("YYYY-MM-DD");
  // console.log(today);

  const res_startDate = response.startDate
    ? dayjs(response.startDate, "YYYY-MM-DD").toDate()
    : null;

  const res_endDate = response.endDate
    ? dayjs(response.endDate, "YYYY-MM-DD").toDate()
    : null;

  const res_startTime = response.startTime
    ? dayjs(`${today} ${response.startTime}`, "YYYY-MM-DD HH:mm").toDate()
    : null;

  const res_endTime = response.endTime
    ? dayjs(`${today} ${response.endTime}`, "YYYY-MM-DD HH:mm").toDate()
    : null;

  const handleAnswerClear = () => {
    dispatch(
      addQuestionResponse({
        id,
        response: {
          startDate: null,
          endDate: null,
          startTime: null,
          endTime: null,
        },
      })
    );
  };

  const validateResponse = () => {
    let errorMessage = "";

    if (isRequired) {
      if (dateOptions === "date" && !response.startDate) {
        errorMessage = "Date is required.";
      }
      if (dateOptions === "time" && !response.startTime) {
        errorMessage = "Time is required.";
      }
      if (
        dateOptions === "both" &&
        (!response.startDate || !response.startTime)
      ) {
        errorMessage = "Both date and time are required.";
      }
      if (allowedDateRange && (!response.startDate || !response.endDate)) {
        errorMessage = "Both start and end dates are required.";
      }
      if (allowedTimeRange && (!response.startTime || !response.endTime)) {
        errorMessage = "Both start and end times are required.";
      }
    }

    if (errorMessage) {
      dispatch(
        updatedQuestionError({ id, isError: true, errMessage: errorMessage })
      );
    } else {
      dispatch(updatedQuestionError({ id, isError: false, errMessage: "" })); // Clear error if valid
    }
  };

  useEffect(() => {
    if (initialized) return;

    validateResponse();
  }, [isRequired, response, initialized]);

  useEffect(() => {
    if (allowedTimeRange && response.startTime && response.endTime) {
      const today = dayjs().format("YYYY-MM-DD");

      const startTime = dayjs(
        `${today} ${response.startTime}`,
        "YYYY-MM-DD HH:mm"
      );
      const endTime = dayjs(`${today} ${response.endTime}`, "YYYY-MM-DD HH:mm");

      const isLater = startTime.isAfter(endTime);

      dispatch(
        updatedQuestionError({
          id,
          isError: isLater, // If `startTime` is after `endTime`, it's an error.
          errMessage: isLater ? "Start time must be before end time." : "",
        })
      );
    }
  }, [response.startTime, response.endTime, allowedTimeRange, dispatch, id]);

  return (
    <>
      <div className="flex flex-col gap-0 5">
        <div className="flex flex-col gap-6">
          {/* Date Section */}
          {showedDate && (
            <>
              {allowedDateRange ? (
                <div className="flex items-center flex-col gap-4 md:flex-row md:gap-8">
                  <div className="w-full flex flex-col gap-2">
                    <div className="text-midnight flex items-center gap-1">
                      <HiOutlineCalendarDateRange />
                      <h5 className="">FROM</h5>
                    </div>
                    <DatePicker
                      id="start"
                      selected={res_startDate}
                      startDate={res_startDate}
                      endDate={res_endDate}
                      dateFormat="YYYY-MM-dd"
                      placeholderText="Select date range"
                      selectsStart
                      className="w-full border-b border-slate-200 focus:border-midnight focus:px-4 py-1.5"
                      onChange={(date) => {
                        // console.log(date);
                        setInitialized(false);
                        // const [start, end] = dates;
                        const formatted_start_date = date
                          ? dayjs(date).format("YYYY-MM-DD")
                          : null;
                        dispatch(
                          addQuestionResponse({
                            id,
                            response: {
                              ...response,
                              startDate: formatted_start_date,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <div className="text-midnight flex items-center gap-1">
                      <HiOutlineCalendarDateRange />
                      <h5 className="">TO</h5>
                    </div>
                    <DatePicker
                      id="end"
                      selected={res_endDate}
                      startDate={res_startDate}
                      endDate={res_endDate}
                      dateFormat="YYYY-MM-dd"
                      placeholderText="Select date range"
                      selectsEnd
                      className="w-full border-b border-slate-200 focus:border-midnight focus:px-4 py-1.5"
                      onChange={(date) => {
                        setInitialized(false);
                        const formatted_end_date = date
                          ? dayjs(date).format("YYYY-MM-DD")
                          : null;

                        dispatch(
                          addQuestionResponse({
                            id,
                            response: {
                              ...response,
                              endDate: formatted_end_date,
                            },
                          })
                        );
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2">
                  <div className="text-midnight flex items-center gap-1">
                    <HiOutlineCalendarDateRange />
                    <h5 className="">DATE</h5>
                  </div>
                  <DatePicker
                    id="date"
                    selected={res_startDate}
                    dateFormat="YYYY-MM-dd"
                    placeholderText="Select date"
                    className="w-full border-b border-slate-200 focus:border-midnight focus:px-4 py-1.5"
                    onChange={(date) => {
                      setInitialized(false);
                      const formated_date = dayjs(date).format("YYYY-MM-DD");
                      const updated_res = { ...response };
                      updated_res["startDate"] = formated_date;
                      dispatch(
                        addQuestionResponse({
                          id,
                          response: updated_res,
                        })
                      );
                    }}
                  />
                </div>
              )}
            </>
          )}

          {/* Time Section */}
          {showedTime && (
            <div className="flex items-center flex-col gap-4 md:flex-row md:gap-8">
              <div className="w-full flex flex-col gap-2">
                <div className="text-midnight flex items-center gap-1">
                  <IoTimeOutline />
                  <h5 className="">{allowedTimeRange ? "FROM" : "TIME"}</h5>
                </div>
                <DatePicker
                  id="start-time"
                  selected={res_startTime}
                  showTimeSelect
                  showTimeSelectOnly
                  timeFormat="HH:mm"
                  dateFormat="HH:mm"
                  placeholderText="Select time"
                  onChange={(date) => {
                    setInitialized(false);
                    if (date) {
                      const hours = date.getHours();
                      const mins = date.getMinutes();

                      const formattedTime = `${hours
                        .toString()
                        .padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
                      const updated_res = { ...response };
                      updated_res["startTime"] = formattedTime;
                      dispatch(
                        addQuestionResponse({
                          id,
                          response: updated_res,
                        })
                      );
                    }
                  }}
                  className="w-full border-b border-slate-200 focus:border-midnight focus:px-4 py-1.5"
                />
              </div>
              {allowedTimeRange && (
                <div className="w-full flex flex-col gap-2">
                  <div className="text-midnight flex items-center gap-1">
                    <IoTimeOutline />
                    <h5 className="">TO</h5>
                  </div>
                  <DatePicker
                    id="end-time"
                    showTimeSelectOnly
                    selected={res_endTime}
                    showTimeSelect
                    timeFormat="HH:mm"
                    dateFormat="HH:mm"
                    placeholderText="Select time"
                    onChange={(date) => {
                      setInitialized(false);
                      const formated_time = dayjs(date).format("HH:mm");
                      const updated_res = { ...response };
                      updated_res["endTime"] = formated_time;
                      dispatch(
                        addQuestionResponse({
                          id,
                          response: updated_res,
                        })
                      );
                    }}
                    className="w-full border-b border-slate-200 focus:border-midnight focus:px-4 py-1.5"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {(response.startDate ||
        response.endDate ||
        response.startTime ||
        response.endTime) && (
        <div className="flex justify-end">
          <button
            onClick={handleAnswerClear}
            className="text-slate-400 text-xs md:text-sm cursor-pointer"
          >
            Clear Selection
          </button>
        </div>
      )}
    </>
  );
};

export default DateResponse;
