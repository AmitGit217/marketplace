import {
  Box,
  Button,
  Flex,
  HStack,
  NativeSelect,
  Separator,
  Spinner,
  Table,
  Text,
} from "@chakra-ui/react";
import {
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LuChevronDown,
  LuChevronLeft,
  LuChevronRight,
  LuChevronUp,
} from "react-icons/lu";

export interface TableColumn<
  T,
  K extends keyof T = keyof T
> {
  key: K;
  label: string;
  render?: (
    value: T[K],
    row: T
  ) => ReactNode;
}

interface ManagementTableProps<
  T extends { id: string | number }
> {
  data: T[];
  columns: TableColumn<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  actions?: (row: T) => ReactNode;
}

type SortDirection = "asc" | "desc";

export function ManagementTable<
  T extends { id: string | number }
>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  actions,
}: ManagementTableProps<T>) {
  const [sortKey, setSortKey] =
    useState<keyof T | null>(null);

  const [sortDirection, setSortDirection] =
    useState<SortDirection>("asc");

  const [pageSize, setPageSize] =
    useState(10);

  const [currentPage, setCurrentPage] =
    useState(1);

  /*
   * Sorting
   */
  const sortedData = useMemo(() => {
    if (!sortKey) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (
        typeof aValue === "number" &&
        typeof bValue === "number"
      ) {
        return sortDirection === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return sortDirection === "asc"
        ? String(aValue).localeCompare(
            String(bValue)
          )
        : String(bValue).localeCompare(
            String(aValue)
          );
    });
  }, [data, sortKey, sortDirection]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedData.length / pageSize
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedData = useMemo(() => {
    const start =
      (safeCurrentPage - 1) * pageSize;

    return sortedData.slice(
      start,
      start + pageSize
    );
  }, [
    sortedData,
    safeCurrentPage,
    pageSize,
  ]);

  /*
   * Sorting
   */
  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDirection((previous) =>
        previous === "asc"
          ? "desc"
          : "asc"
      );
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }

    setCurrentPage(1);
  };

  /*
   * Page size
   */
  const handlePageSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPageSize(
      Number(event.target.value)
    );
    setCurrentPage(1);
  };

  /*
   * Loading
   */
  if (isLoading) {
    return (
      <Flex
        minH="300px"
        align="center"
        justify="center"
        direction="column"
        gap={4}
      >
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner
            size="xl"
            colorPalette="brand"
            borderWidth="3px"
          />

          <Box
            position="absolute"
            w="8px"
            h="8px"
            borderRadius="full"
            bg="colorPalette.500"
          />
        </Box>

        <Text
          fontSize="sm"
          color="fg.muted"
          fontWeight="500"
        >
          Loading data...
        </Text>
      </Flex>
    );
  }

  /*
   * Empty
   */
  if (data.length === 0) {
    return (
      <Flex
        minH="300px"
        align="center"
        justify="center"
      >
        <Text color="fg.muted">
          No data found.
        </Text>
      </Flex>
    );
  }

  const renderCell = (
    column: TableColumn<T>,
    row: T
  ) => {
    return column.render ? (
      column.render(
        row[column.key],
        row
      )
    ) : (
      <Text>
        {String(
          row[column.key] ?? "-"
        )}
      </Text>
    );
  };

  return (
    <Box>
      {/* =========================
          CONTROLS
      ========================= */}
      <Flex
        mb={4}
        justify="space-between"
        align={{
          base: "stretch",
          md: "center",
        }}
        direction={{
          base: "column",
          md: "row",
        }}
        gap={3}
      >
        {/* SORT */}
        <Flex
          align="center"
          gap={2}
          width={{
            base: "full",
            md: "auto",
          }}
        >
          <Text
            fontSize="sm"
            color="fg.muted"
            whiteSpace="nowrap"
          >
            Sort by
          </Text>

          <NativeSelect.Root
            size="sm"
            width={{
              base: "full",
              md: "180px",
            }}
          >
            <NativeSelect.Field
              value={
                sortKey
                  ? String(sortKey)
                  : ""
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                if (!value) {
                  setSortKey(null);
                  setCurrentPage(1);
                  return;
                }

                handleSort(
                  value as keyof T
                );
              }}
            >
              <option value="">
                Default
              </option>

              {columns.map((column) => (
                <option
                  key={String(
                    column.key
                  )}
                  value={String(
                    column.key
                  )}
                >
                  {column.label}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>

          {sortKey && (
            <Button
              size="sm"
              variant="ghost"
              flexShrink={0}
              onClick={() =>
                handleSort(sortKey)
              }
              aria-label="Change sort direction"
            >
              {sortDirection ===
              "asc" ? (
                <LuChevronUp />
              ) : (
                <LuChevronDown />
              )}
            </Button>
          )}
        </Flex>

        {/* ROWS */}
        <Flex
          align="center"
          gap={2}
        >
          <Text
            fontSize="sm"
            color="fg.muted"
            whiteSpace="nowrap"
          >
            Rows
          </Text>

          <NativeSelect.Root
            size="sm"
            width="90px"
          >
            <NativeSelect.Field
              value={pageSize}
              onChange={
                handlePageSizeChange
              }
            >
              <option value={5}>
                5
              </option>

              <option value={10}>
                10
              </option>

              <option value={25}>
                25
              </option>

              <option value={50}>
                50
              </option>
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Flex>
      </Flex>

      {/* =========================
          DESKTOP TABLE
      ========================= */}
      <Box
        display={{
          base: "none",
          md: "block",
        }}
        overflowX="auto"
        borderWidth="1px"
        borderRadius="xl"
      >
        <Table.Root
          variant="outline"
          size="sm"
          interactive
        >
          <Table.Header>
            <Table.Row>
              {columns.map((column) => {
                const isSorted =
                  sortKey ===
                  column.key;

                return (
                  <Table.ColumnHeader
                    key={String(
                      column.key
                    )}
                    whiteSpace="nowrap"
                    cursor="pointer"
                    userSelect="none"
                    onClick={() =>
                      handleSort(
                        column.key
                      )
                    }
                    _hover={{
                      bg: "blackAlpha.50",
                      _dark: {
                        bg: "whiteAlpha.50",
                      },
                    }}
                  >
                    <HStack gap={1}>
                      <Text>
                        {column.label}
                      </Text>

                      {isSorted &&
                        (sortDirection ===
                        "asc" ? (
                          <LuChevronUp />
                        ) : (
                          <LuChevronDown />
                        ))}
                    </HStack>
                  </Table.ColumnHeader>
                );
              })}

             {actions &&
  paginatedData.some((row) => actions(row) !== null) && (
    <Table.ColumnHeader textAlign="right">
      Actions
    </Table.ColumnHeader>
  )}
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {paginatedData.map((row) => (
              <Table.Row
                key={row.id}
                cursor={
                  onRowClick
                    ? "pointer"
                    : "default"
                }
                onClick={() =>
                  onRowClick?.(row)
                }
                _hover={{
                  bg: "blackAlpha.50",
                  _dark: {
                    bg: "whiteAlpha.50",
                  },
                }}
              >
                {columns.map(
                  (column) => (
                    <Table.Cell
                      key={String(
                        column.key
                      )}
                      whiteSpace="nowrap"
                    >
                      {renderCell(
                        column,
                        row
                      )}
                    </Table.Cell>
                  )
                )}

                {actions && actions(row) !== null && (
  <Table.Cell textAlign="right">
    <Box
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      {actions(row)}
    </Box>
  </Table.Cell>
)}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>

      {/* =========================
          MOBILE CARDS
      ========================= */}
      <Box
        display={{
          base: "block",
          md: "none",
        }}
      >
        <Flex
          direction="column"
          gap={3}
        >
          {paginatedData.map((row) => (
            <Box
              key={row.id}
              borderWidth="1px"
              borderRadius="xl"
              p={4}
              cursor={
                onRowClick
                  ? "pointer"
                  : "default"
              }
              onClick={() =>
                onRowClick?.(row)
              }
              transition="all 0.15s ease"
              _hover={{
                borderColor:
                  "colorPalette.300",
                shadow: "sm",
              }}
              _active={{
                transform:
                  "scale(0.99)",
              }}
            >
              {columns.map(
                (column, index) => (
                  <Box
                    key={String(
                      column.key
                    )}
                  >
                    {index > 0 && (
                      <Separator my={3} />
                    )}

                    <Flex
                      justify="space-between"
                      align="center"
                      gap={4}
                    >
                      <Text
                        fontSize="xs"
                        color="fg.muted"
                        fontWeight="500"
                        flexShrink={0}
                      >
                        {column.label}
                      </Text>

                      <Box
                        textAlign="right"
                        minW={0}
                      >
                        {renderCell(
                          column,
                          row
                        )}
                      </Box>
                    </Flex>
                  </Box>
                )
              )}

              {actions && actions(row) !== null && (
  <>
    <Separator my={3} />

    <Flex justify="flex-end">
      <Box
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {actions(row)}
      </Box>
    </Flex>
  </>
)}
            </Box>
          ))}
        </Flex>
      </Box>

      {/* =========================
          PAGINATION
      ========================= */}
      <Flex
        mt={4}
        justify="space-between"
        align="center"
        gap={3}
        direction={{
          base: "column",
          sm: "row",
        }}
      >
        <Text
          fontSize="sm"
          color="fg.muted"
        >
          {(safeCurrentPage - 1) *
            pageSize +
            1}{" "}
          –{" "}
          {Math.min(
            safeCurrentPage *
              pageSize,
            sortedData.length
          )}{" "}
          of {sortedData.length}
        </Text>

        <HStack
          width={{
            base: "full",
            sm: "auto",
          }}
        >
          <Button
            size="sm"
            variant="outline"
            flex={1}
            disabled={
              safeCurrentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  Math.max(
                    1,
                    page - 1
                  )
              )
            }
          >
            <LuChevronLeft />

            <Text
              display={{
                base: "none",
                sm: "block",
              }}
            >
              Previous
            </Text>
          </Button>

          <Text
            fontSize="sm"
            minW="70px"
            textAlign="center"
          >
            {safeCurrentPage} /{" "}
            {totalPages}
          </Text>

          <Button
            size="sm"
            variant="outline"
            flex={1}
            disabled={
              safeCurrentPage ===
              totalPages
            }
            onClick={() =>
              setCurrentPage(
                (page) =>
                  Math.min(
                    totalPages,
                    page + 1
                  )
              )
            }
          >
            <Text
              display={{
                base: "none",
                sm: "block",
              }}
            >
              Next
            </Text>

            <LuChevronRight />
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}