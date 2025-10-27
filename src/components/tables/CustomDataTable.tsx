 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useMemo, useCallback } from "react";
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
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  ComboboxData,
  Flex,
  Pagination,
  Skeleton,
  Space,
  Table,
} from "@mantine/core";
import CustomInput from "../molecules/inputs/CustomInput";
import { IconSearch } from "@tabler/icons-react";
import CustomDateRangeFilter from "../molecules/filters/CustomDateRangeFilter";

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

export const fallbackData = [];

export type GenericTableProps<T> = {
  data: T[] | undefined;
  columns: ColumnDef<T, any>[];
  placeHolder: string;
  refetchData?: () => void;
  total: number;
  limit: number;
  filterList?: {
    name: string;
    placeholder: string;
    items: ComboboxData | undefined;
  }[];
  isLoading?: boolean;
  handleRowClick?: (row: T) => void;
  onTableInstanceChange?: (instance: any) => void;
  setNewDateRange?: (dates: [string | null, string | null]) => void;
  filterComponent?: React.JSX.Element; // Fixed: provide default value properly
};

export function CustomDataTable<T>({
  handleRowClick,
  placeHolder,
  columns,
  data, // Fixed: provide default value properly
  limit,
  total,
  filterList,
  isLoading = false, // Fixed: provide default value
  onTableInstanceChange,
  setNewDateRange,
}: GenericTableProps<T>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  // Memoize expensive calculations
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  // Memoize table instance to prevent unnecessary re-renders
  const table = useReactTable({
    data: data ?? fallbackData, // Ensure data is never undefined
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: limit,
      },
    },
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "fuzzy",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // Memoize the search handler to prevent recreation on every render
  const handleSearch = useDebouncedCallback((e) => {
    setGlobalFilter(e);
  }, 300);

  const handleFilterChange = (columnId: string, value: string | null) => {
    setColumnFilters((prev) => {
      const filtered = prev.filter((filter) => filter.id !== columnId);
      if (value && value !== "all" && value !== null && value !== undefined) {
        filtered.push({ id: columnId, value });
      }
      return filtered;
    });
  };

  // Notify parent of table instance changes
  useEffect(() => {
    if (onTableInstanceChange) {
      onTableInstanceChange(table);
    }
  }, [table, onTableInstanceChange]);

  // Memoize row click handler
  const handleTableRowClick = useCallback(
    (row: T) => {
      return (event: React.MouseEvent) => {
        const target = event.target as HTMLElement;

        // Check if clicked element is inside a checkbox container
        if (
          target.closest('input[type="checkbox"]') ||
          target.closest('[role="checkbox"]') ||
          target.getAttribute("aria-label")?.includes("Select")
        ) {
          return;
        }

        // Check if clicked element has checkbox-related classes (Mantine specific)
        if (
          target.classList.contains("mantine-Checkbox-input") ||
          target.classList.contains("mantine-Checkbox-icon") ||
          target.classList.contains("mantine-Checkbox-root") ||
          target.closest(".mantine-Checkbox-root")
        ) {
          return;
        }

        if (handleRowClick) {
          handleRowClick(row);
        }
      };
    },
    [handleRowClick]
  );

  const filterComponent = (
    <div className="flex gap-2 justify-end">
      {filterList?.map((opp, index) => (
        <CustomInput
          key={index}
          type="select"
          placeholder={opp.placeholder}
          size="md"
          radius="xl"
          data={opp.items}
          data-column-id={opp.name}
          onChange={(_, option) => handleFilterChange(opp.name, option.value)}
        />
      ))}
    </div>
  );

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
        <div className="flex gap-2 items-center">
          {filterComponent && filterComponent}
          {setNewDateRange && (
            <CustomDateRangeFilter
              setNewDateRange={setNewDateRange}
              placeholder="Select Date"
              isLoading={isLoading}
            />
          )}
        </div>
      </Flex>
      <Space h="md" />
      <Table
        styles={{
          tbody: { fontSize: "13.5px" },
          thead: {
            fontSize: "14.5px",
            fontWeight: "700",
            color: "#000",
          },
        }}
        striped
        highlightOnHover
        withTableBorder
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
          {isLoading &&
            Array(limit)
              .fill("_")
              .map((_, index) => {
                return (
                  <Table.Tr key={`skeleton-${index}`}>
                    {Array(columns.length)
                      .fill("_")
                      .map((_, cellIndex) => {
                        return (
                          <Table.Td
                            className="c-table-td"
                            key={`skeleton-cell-${cellIndex}`}
                          >
                            <Skeleton height={10} radius="xl" />
                          </Table.Td>
                        );
                      })}
                  </Table.Tr>
                );
              })}
          {!table.getRowModel().rows?.length && !isLoading ? (
            <Table.Tr>
              <Table.Td colSpan={columns.length} className="h-24 text-center">
                No results.
              </Table.Td>
            </Table.Tr>
          ) : (
            !isLoading &&
            table?.getRowModel()?.rows?.map((row) => {
              return (
                <Table.Tr
                  onClick={handleTableRowClick(row.original)}
                  key={row.id}
                  style={{ cursor: handleRowClick ? "pointer" : "default" }}
                >
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
      {!isLoading && (
        <Pagination
          onChange={(val) => table.setPageIndex(val - 1)}
          total={totalPages}
          value={table.getState().pagination.pageIndex + 1}
        />
      )}
    </div>
  );
}

// Add display name for better debugging
CustomDataTable.displayName = "CustomDataTable";

export default CustomDataTable;
