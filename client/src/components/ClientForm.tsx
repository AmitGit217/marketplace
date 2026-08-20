import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Separator,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuArrowLeft, LuSave } from "react-icons/lu";

export interface ClientFormData {
  name: string;
  email: string;
  preferences: string;
}

interface ClientFormProps {
  title: string;
  initialValues?: ClientFormData;
  submitLabel: string;
  isSaving: boolean;
  onBack: () => void;
  onSubmit: (data: ClientFormData) => Promise<void>;
}

export default function ClientForm({
  title,
  initialValues,
  submitLabel,
  isSaving,
  onBack,
  onSubmit,
}: ClientFormProps) {
  const [name, setName] = useState(
    initialValues?.name ?? "",
  );

  const [email, setEmail] = useState(
    initialValues?.email ?? "",
  );

  const [preferences, setPreferences] =
    useState(
      initialValues?.preferences ?? "",
    );

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    await onSubmit({
      name,
      email,
      preferences,
    });
  };

  return (
    <Box maxW="800px" mx="auto">
      <Flex
        align="center"
        mb={6}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            onBack()
          }
        >
          <LuArrowLeft />
          Back
        </Button>
      </Flex>

      <Heading size="lg" mb={6}>
        {title}
      </Heading>

      <Card.Root
        borderRadius="2xl"
        shadow="sm"
      >
        <Card.Body
          p={{ base: 5, md: 8 }}
        >
          <form onSubmit={handleSubmit}>
            <Flex
              direction="column"
              gap={5}
            >
              <Field.Root required>
                <Field.Label>
                  Name
                </Field.Label>

                <Input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="John Smith"
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>
                  Email
                </Field.Label>

                <Input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="john@example.com"
                />
              </Field.Root>

              <Separator />

              <Field.Root>
                <Field.Label>
                  Preferences
                </Field.Label>

                <Textarea
                  value={preferences}
                  onChange={(e) =>
                    setPreferences(
                      e.target.value,
                    )
                  }
                  placeholder="Client preferences..."
                  rows={5}
                />
              </Field.Root>

              <Flex
                justify="flex-end"
                gap={3}
                mt={3}
              >
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    onBack()
                  }
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  colorPalette="brand"
                  loading={isSaving}
                  disabled={!name.trim()}
                >
                  <LuSave />
                  {submitLabel}
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}