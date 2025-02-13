/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import { forwardRef, useMemo, useState } from "react";
import { QuestionsDataResType } from "../../state/form/dataSlice";

const ResponseTable = forwardRef<
  HTMLTableElement,
  { questions: any; answers: any }
>(({ questions, answers }: any, ref) => {
  const [sourceSorting, setSourceSorting] = useState<SortingState>([]);
  const columnHelper = createColumnHelper();

  const tableData = useMemo(() => {
    return answers.map((response: any) => {
      const row: any = { respondentId: response.respondentId };

      // Map the answers to their respective question columns
      questions.forEach(({ questionId }: QuestionsDataResType) => {
        const answer = response[questionId];
        row[questionId] = answer; // Add each answer to the row by questionId
      });

      return row;
    });
  }, [questions, answers]);

  const columns = questions.map(
    ({ question, questionId }: any, index: number) => {
      if (question === "rank") {
        return columnHelper.accessor(questionId, {
          header: () => "",
          cell: () => (
            <p className="text-xs text-midnight opacity-80">{index + 1}</p>
          ),
        });
      } else {
        return columnHelper.accessor(questionId, {
          header: () => question,
          cell: (info) => (
            <p className="text-xs text-midnight opacity-80 whitespace-pre-wrap">
              {info.getValue() as string}
            </p>
          ),
        });
      }
    }
  );
  // info.renderValue()

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting: sourceSorting,
    },
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSourceSorting,
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });
  return (
    <>
      <table ref={ref} className="w-full">
        <thead className="bg-midnight text-white">
          {table.getHeaderGroups().map((headerGroup) => {
            return (
              <tr
                key={headerGroup.id}
                className=""
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${columns.length}, minmax(150px, 1fr))`,
                }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      className="text-sm"
                      key={header.id}
                      {...{
                        onClick: header.column.getToggleSortingHandler(),
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody className="text-midnight-60 text-sm">
          <>
            {table.getRowModel().rows.map((row, index) => {
              return (
                <tr
                  className={`${index % 2 === 0 && "bg-white-40"} py-1`}
                  key={row.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${columns.length}, minmax(150px, 1fr))`,
                  }}
                >
                  {row.getVisibleCells().map((cell, index) => {
                    return (
                      <td
                        className={`h-full flex items-center px-2 ${
                          index !== 0
                            ? "border-l border-violet"
                            : "justify-center"
                        }`}
                        key={cell.id}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </>
        </tbody>
        {/* {answers.length <= 0 && (
        <div className="w-full text-midnight-60 flex justify-start px-16 py-1 text-sm">
          Currently no data
        </div>
      )} */}
      </table>
    </>
  );
});

export default ResponseTable;
