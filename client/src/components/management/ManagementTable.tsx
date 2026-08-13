import {
  Table,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

export interface TableColumn<T, K extends keyof T = keyof T> {
  key: K;
  label: string;
  render?: (value: T[K], row: T) => ReactNode;
}

interface ManagementTableProps<T extends { id: string | number }> {
  data: T[];
  columns: TableColumn<T>[];
}

export function ManagementTable<T extends { id: string | number }>({
  data,
  columns,
}: ManagementTableProps<T>) {
  return (
    <Table.Root variant="outline" size="sm">
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeader key={String(column.key)}>
              {column.label}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.map((row) => (
          <Table.Row
            key={row.id}
            cursor="pointer"
            _hover={{
              bg: "blackAlpha.50",
              _dark: {
                bg: "whiteAlpha.50",
              },
            }}
          >
            {columns.map((column) => (
              <Table.Cell key={String(column.key)}>
                {column.render ? (
                  column.render(row[column.key], row)
                ) : (
                  <Text>
                    {String(row[column.key] ?? "-")}
                  </Text>
                )}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
}