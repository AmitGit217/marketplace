import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";

import type { Client } from "@/types/client";
import { clientsApi } from "@/api/clients";

import {
  ManagementTable,
  type TableColumn,
} from "@/components/management/ManagementTable";

const clientColumns: TableColumn<Client>[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
    render: (value) => {
      if (value == null) return "-";

      return typeof value === "string" ||
        typeof value === "number"
        ? String(value)
        : JSON.stringify(value);
    },
  },
  {
    key: "preferences",
    label: "Preferences",
    render: (value) => {
      if (value == null) return "-";

      if (Array.isArray(value)) {
        return value
          .map((item) =>
            typeof item === "object"
              ? JSON.stringify(item)
              : String(item),
          )
          .join(", ");
      }

      return typeof value === "string" ||
        typeof value === "number"
        ? value
        : String(value);
    },
  },
];

export default function Clients() {
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadClients = async () => {
      try {
        const data = await clientsApi.getAll();
        setClients(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  return (
    <>
      <Flex justify="flex-end" mb={4}>
        <Button
          colorPalette="brand"
          onClick={() => navigate("/clients/new")}
        >
          <LuPlus />
          Add client
        </Button>
      </Flex>

      <ManagementTable
        data={clients}
        columns={clientColumns}
        isLoading={isLoading}
        onRowClick={(client) =>
          navigate(`/clients/${client.id}`)
        }
      />
    </>
  );
}