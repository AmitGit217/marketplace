import {
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  NativeSelect,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowLeft, LuSave } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export interface PersonnelFormData {
  name: string;
  email: string;
  password: string;
  role: string;
  preferences: string;
}

interface PersonnelFormProps {
  initialData?: Partial<PersonnelFormData>;
  onSubmit: (data: PersonnelFormData) => Promise<void>;
  isEdit?: boolean;
  isLoading?: boolean;
}

export default function PersonnelForm({
  initialData,
  onSubmit,
  isEdit = false,
  isLoading = false,
}: PersonnelFormProps) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PersonnelFormData>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    password: "",
    role: initialData?.role ?? "employee",
    preferences: initialData?.preferences ?? "",
  });

  const handleChange = (
    field: keyof PersonnelFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Flex
      direction="column"
      maxW="700px"
      mx="auto"
      w="100%"
      gap={6}
    >
      <Flex align="center" gap={3}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/personnel")}
        >
          <LuArrowLeft />
        </Button>

        <Heading size="lg">
          {isEdit ? "Edit Personnel" : "Create Personnel"}
        </Heading>
      </Flex>

      <Card.Root>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap={5}>
              <Field.Root required>
                <Field.Label>Name</Field.Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    handleChange("name", e.target.value)
                  }
                  placeholder="John Doe"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    handleChange("email", e.target.value)
                  }
                  placeholder="john@example.com"
                />
              </Field.Root>

              <Field.Root required={!isEdit}>
                <Field.Label>
                  Password
                  {isEdit && " (leave empty to keep current)"}
                </Field.Label>

                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    handleChange("password", e.target.value)
                  }
                  placeholder={
                    isEdit
                      ? "Leave empty to keep current password"
                      : "Password"
                  }
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Role</Field.Label>

                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={formData.role}
                    onChange={(e) =>
                      handleChange("role", e.target.value)
                    }
                  >
                    <option value="employee">
                      Employee
                    </option>
                    <option value="admin">
                      Admin
                    </option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Preferences</Field.Label>
                <Textarea
                  value={formData.preferences}
                  onChange={(e) =>
                    handleChange(
                      "preferences",
                      e.target.value,
                    )
                  }
                  placeholder="Optional preferences..."
                />
              </Field.Root>

              <Flex justify="flex-end" gap={3} pt={2}>
                <Button
                  variant="outline"
                  onClick={() => navigate("/personnel")}
                  type="button"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={isLoading}
                >
                  <LuSave />
                  {isEdit ? "Save Changes" : "Create Personnel"}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}