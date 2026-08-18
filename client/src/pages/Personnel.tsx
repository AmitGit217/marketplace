import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


import {
  ManagementTable,
  type TableColumn,
} from "@/components/management/ManagementTable";
import type { User } from "@/types/user";
import { usersApi } from "@/api/users";

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

  const [personnel, setPersonnel] =
    useState<User[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadPersonnel = async () => {
      try {
        const data =
          await usersApi.getAll();

        setPersonnel(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonnel();
  }, []);

  return (
    <ManagementTable
      data={personnel}
      columns={personnelColumns}
      isLoading={isLoading}
      onRowClick={(person) =>
        navigate(`/personnel/${person.id}`)
      }
    />
  );
}