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

  const [personnel, setPersonnel] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const loadPersonnel = async () => {
      try {
        const data = await usersApi.getAll();
        setPersonnel(data);
      } catch (error) {
        console.error(
          "Failed to load personnel:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonnel();
  }, []);

  /*
   * Determine whether this row belongs to
   * the currently authenticated user.
   *
   * ID is the primary comparison.
   * Email is a fallback in case the API returns
   * different ID types/representations.
   */
  const isCurrentUser = (person: User) => {
    if (!user) {
      return false;
    }

    const sameId =
      String(person.id) === String(user.id);

    const sameEmail =
      person.email.trim().toLowerCase() ===
      user.email.trim().toLowerCase();

    return sameId || sameEmail;
  };

  const handleDelete = async (id: number) => {
    if (!isAdmin) {
      return;
    }

    // Never allow the authenticated user to delete themselves.
    const person = personnel.find(
      (item) => item.id === id
    );

    if (!person || isCurrentUser(person)) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this personnel member?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await usersApi.delete(id);

      setPersonnel((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete personnel:",
        error
      );
    }
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
            ? (person) => {
                /*
                 * CRITICAL:
                 * No action is rendered for the
                 * currently authenticated user.
                 */
                if (isCurrentUser(person)) {
                  return null;
                }

                return (
                  <Button
                    size="sm"
                    variant="ghost"
                    colorPalette="red"
                    aria-label={`Delete ${person.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete(person.id);
                    }}
                  >
                    <LuTrash2 />
                  </Button>
                );
              }
            : undefined
        }
      />
    </Flex>
  );
}