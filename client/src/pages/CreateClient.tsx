import {
  Box,
  Button,
  Card,
  Field,
  Flex,
  Heading,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft, LuSave } from "react-icons/lu";

import { clientsApi } from "@/api/clients";

export default function ClientCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    try {
      setIsSaving(true);

      const client = await clientsApi.create({
        name,
        email: email || undefined,
        preferences: preferences || undefined,
      });

      navigate(`/clients/${client.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Box maxW="800px" mx="auto">
      <Flex align="center" mb={6}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/clients")}
        >
          <LuArrowLeft />
          Back to clients
        </Button>
      </Flex>

      <Heading size="lg" mb={6}>
        Add client
      </Heading>

      <Card.Root
        borderRadius="2xl"
        shadow="sm"
      >
        <Card.Body p={{ base: 5, md: 8 }}>
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
                    navigate("/clients")
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
                  Create client
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}