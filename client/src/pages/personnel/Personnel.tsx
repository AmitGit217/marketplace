import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Flex } from "@chakra-ui/react";
import { LuPlus, LuTrash2 } from "react-icons/lu";

import {
  ManagementTable,
  type TableColumn,
} from "@/components/management/ManagementTable";

import type { User } from "@/types/user";
import { usersApi } from "@/api/users";
import { useAuth } from "@/context/authContext";

const personnelColumns: TableColumn<User>[] = [
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
  },
  {
    key: "role",
    label: "Role",
  },
];

export default function Personnel() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [personnel, setPersonnel] =
    useState<User[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadPersonnel = async () => {
      try {
        const data = await usersApi.getAll();
        setPersonnel(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonnel();
  }, []);

  const handleDelete = async (id: number) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this personnel member?"
    );

    if (!confirmed) return;

    await usersApi.delete(id);

    setPersonnel((current) =>
      current.filter((person) => person.id !== id)
    );
  };

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end">
        <Button
          onClick={() =>
            navigate("/personnel/create")
          }
        >
          <LuPlus />
          Create Personnel
        </Button>
      </Flex>

      <ManagementTable
        data={personnel}
        columns={personnelColumns}
        isLoading={isLoading}
        onRowClick={(person) =>
          navigate(`/personnel/${person.id}`)
        }
        actions={
          isAdmin
            ? (person) => (
                <Button
                  size="sm"
                  variant="ghost"
                  colorPalette="red"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(person.id);
                  }}
                >
                  <LuTrash2 />
                </Button>
              )
            : undefined
        }
      />
    </Flex>
  );
}