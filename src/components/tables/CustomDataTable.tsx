/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  RankingInfo,
  rankItem,
} from "@tanstack/match-sorter-utils";
import { Pagination, Space, Table } from "@mantine/core";
import CustomInput from "../inputs/CustomInput";

declare module "@tanstack/react-table" {
  //add fuzzy filter to the filterFns
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information

type GenericTableProps<T> = {
  data: T[]
  columns: ColumnDef<T, any>[];
  placeHolder: string;
  refetchData?: () => void;
  total: number;
  limit: number
};

export function CustomDataTable<T>({ placeHolder, columns, data, limit, total}: GenericTableProps<T>) {

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  //const refreshData = () => refetchData() //refetch Data(); //stress test

  const totalPages = Math.ceil(total / limit);

  const table = useReactTable({
    data,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter, //define as a filter function that can be used in column definitions
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        //pageIndex: 2, //custom initial page index
        pageSize: limit //custom default page size
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy", //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(), //client side filtering
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    /* debugTable: true,
    debugHeaders: true,
    debugColumns: false, */
  });

  //apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.getState().columnFilters[0]?.id === "fullName") {
      if (table.getState().sorting[0]?.id !== "fullName") {
        table.setSorting([{ id: "fullName", desc: false }]);
      }
    }
  }, [table.getState().columnFilters[0]?.id]);

  const handleSearch = useDebouncedCallback((e) => {
    setGlobalFilter(e);
  }, 300);

  return (
    <div className="p-2">
      <div>
        <CustomInput
          type="text"
          defaultValue={globalFilter ?? ""}
          onChange={(value: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch(value.target.value)
          }
          className="max-w-md w-full"
          placeholder={placeHolder}
          size="md"
          radius="xl"
        />
      </div>
      <Space h="md" />
      <Table
        styles={{ tbody: { fontSize: "13.5px" }, thead: { fontSize: "16px" } }}
        striped
        highlightOnHover
        withTableBorder
      >
        <Table.Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </Table.Th>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Thead>
        <Table.Tbody>
          {!table.getRowModel().rows?.length ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} className="h-24 text-center">
                No results.
              </Table.Td>
            </Table.Tr>
          ) : (
            table?.getRowModel()?.rows?.map((row) => {
              return (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Table.Td className="c-table-td" key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>
      <Space h="lg" />
      <Pagination
        onChange={(val) => table.setPageIndex(val - 1)}
        total={totalPages}
        value={table.getState().pagination.pageIndex + 1}
      />
      {/*  <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
      </div>
      <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div> */}
    </div>
  );
}