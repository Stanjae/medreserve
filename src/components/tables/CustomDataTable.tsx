/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { ReactNode, useEffect, useState } from "react";
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
import { Flex, Pagination, Space, Table } from "@mantine/core";
import CustomInput from "../inputs/CustomInput";
import { IconSearch } from "@tabler/icons-react";

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
  limit: number;
  filterComponent:React.JSX.Element
};

export function CustomDataTable<T>({ placeHolder, columns, data, limit, total, filterComponent}: GenericTableProps<T>) {

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

/*   //apply the fuzzy sort if the fullName column is being filtered
  React.useEffect(() => {
    if (table.getState().columnFilters[1]?.id === "doctorName") {
      if (table.getState().sorting[1]?.id !== "doctorName") {
        table.setSorting([{ id: "doctorName", desc: false }]);
      }
    }
    console.log('oppp',table.getState().columnFilters);
  }, [table.getState().columnFilters[1]?.id]); */

  const handleSearch = useDebouncedCallback((e) => {
    setGlobalFilter(e);
  }, 300);

/*   const handleFiltersChange = (e: string) => {
    setColumnFilters(e);
     /*  if (e == "all" || !e) {
        table.resetColumnFilters();
        return;
      }
      table.getColumn("timeFrameStatus")?.setFilterValue(e);
    
  }  */
  const [selectValues, setSelectValues] = useState<
    Record<number, string | null>
  >({});

  // Mantine Select onChange passes the new value (string | null)
  function handleSelectChange(index: number, value: string | null) {
    setSelectValues((prev) => ({
      ...prev,
      [index]: value,
    }));
    console.log('abel', index, value);
  }


  // Clone each Mantine Select child injecting controlled value & onChange
  const enhancedSelects: ReactNode = React.Children.map(
    filterComponent.props.children,
    (child: any, index) => {
      const opera = child?.props.type as string
      if (React.isValidElement(child) && opera) {
        return React.cloneElement(child, {
          value: selectValues[index] ?? null, // controlled value, default null
          onChange: (value: string | null) => handleSelectChange(index, value),
        } as {value:string | null, onChange: (value: string | null) => void});
      }
      return child; // pass through non-Select children untouched
    }
  );

  const getColumnFiltersFromSelects = (
    selectValues: Record<number, string | null>,
    selects: ReactNode
  ): ColumnFiltersState => {
    const filters: ColumnFiltersState = [];

    React.Children.forEach(selects, (child: React.ReactNode, index) => {
      if (
        React.isValidElement(child) &&
        selectValues[index] !== null &&
        selectValues[index] !== undefined &&
        selectValues[index] !== ""
      ) {
        const child2 = child as {props: { "data-column-id": string }}
        const columnId = child2.props["data-column-id"] as string | undefined;
        if (columnId) {
          filters.push({
            id: columnId,
            value: selectValues[index]!,
          });
        }
      }
    });

    return filters;
  };

  useEffect(() => {
    const filtersFromSelects = getColumnFiltersFromSelects(
      selectValues,
      filterComponent.props.children
    );
    console.log("filtersFromSelects", filtersFromSelects);
    setColumnFilters(filtersFromSelects);
  }, [selectValues, filterComponent.props.children]);

  return (
    <div className="p-2">
      <Flex justify={"space-between"}>
        <CustomInput
          type="text"
          defaultValue={globalFilter ?? ""}
          onChange={(value: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch(value.target.value)
          }
          className="max-w-3xl block focus-within:w-[500px] duration-750 transition-all w-full"
          placeholder={placeHolder}
          leftSection={<IconSearch />}
          size="md"
          radius="xl"
        />
        {enhancedSelects}
      </Flex>
      <Space h="md" />
      <Table
        styles={{
          tbody: { fontSize: "13.5px" },
          thead: {
            fontSize: "14.5px",
            fontWeight: "700",
            color: '#000'//"#283779",
          },
        }}
        striped
        highlightOnHover
        withTableBorder
        className=" shadow-md"
        verticalSpacing={"md"}
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