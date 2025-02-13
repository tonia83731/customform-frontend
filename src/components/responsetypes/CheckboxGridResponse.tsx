/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch } from "react-redux";
import {
  addQuestionResponse,
  updatedQuestionError,
} from "../../state/form/responseSlice";
import { useEffect, useState } from "react";

const CheckboxGridResponse = ({
  id,
  rowOptions,
  colOptions,
  response,
  hasLimit,
  maxSelectLimit,
  isRequired,
}: {
  id: string;
  rowOptions: string[];
  colOptions: string[];
  response: any;
  hasLimit: boolean;
  maxSelectLimit?: number | null;
  isRequired: boolean;
}) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(true);
  const [hasResponse, setHasResponse] = useState(false);

  const handleAnswerClear = () => {
    const updated_res = { ...response };
    for (const key in updated_res) {
      updated_res[key] = [];
    }
    dispatch(
      addQuestionResponse({
        id,
        response: updated_res,
      })
    );
  };

  useEffect(() => {
    let foundResponse = false;
    for (const key in response) {
      if (Array.isArray(response[key]) && response[key].length > 0) {
        foundResponse = true;
        break;
      }
    }
    setHasResponse(foundResponse);
  }, [response]);

  useEffect(() => {
    if (isInitialized) return;
    if (!isInitialized && isRequired && !hasResponse) {
      dispatch(
        updatedQuestionError({
          id,
          isError: true,
          errMessage: "This filed is required",
        })
      );
      return;
    }
    dispatch(
      updatedQuestionError({
        id,
        isError: false,
        errMessage: "",
      })
    );
  }, [isInitialized, hasResponse, isRequired]);

  return (
    <>
      <table>
        <thead>
          <tr
            className="text-white"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${
                rowOptions.length + 1
              }, minmax(0, 1fr))`,
            }}
          >
            <th className=""></th>
            {rowOptions.map((row, rowIdx) => {
              return (
                <th
                  className="text-midnight py-2 font-bold"
                  key={`row-${rowIdx}`}
                >
                  {row}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {colOptions.map((col, colIdx) => (
            <tr
              className={`bg-violet text-midnight py-1.5 ${
                colIdx !== 0 && "border-t border-white"
              }`}
              key={`col-${colIdx}`}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${
                  rowOptions.length + 1
                }, minmax(0, 1fr))`,
              }}
            >
              <td className="px-4 font-bold h-full flex items-center">{col}</td>
              {rowOptions.map((row, rowIdx) => (
                <td
                  key={`row-${rowIdx}-col-${colIdx}`}
                  className="p-2 text-center"
                >
                  <input
                    type="checkbox"
                    className="accent-hot"
                    disabled={
                      hasLimit &&
                      maxSelectLimit &&
                      response[colIdx].length >= maxSelectLimit &&
                      !response[colIdx].includes(row)
                        ? true
                        : false
                    }
                    checked={response[colIdx].includes(row)}
                    onChange={() => {
                      setIsInitialized(false);
                      const updated_res = { ...response };

                      const arr = Array.isArray(updated_res[colIdx])
                        ? updated_res[colIdx]
                        : [];

                      const newArr = arr.includes(row)
                        ? arr.filter((item) => item !== row)
                        : [...arr, row];

                      updated_res[colIdx] = newArr;

                      dispatch(
                        addQuestionResponse({
                          id,
                          response: updated_res,
                        })
                      );
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {hasResponse && (
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

export default CheckboxGridResponse;
