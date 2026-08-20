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
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuSave } from "react-icons/lu";

import type { Client } from "@/types/client";
import { clientsApi } from "@/api/clients";

export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] = useState<Client | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [preferences, setPreferences] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await clientsApi.getById(Number(id));

        setClient(data);
        setName(data.name ?? "");
        setEmail(data.email ?? "");
        setPreferences(data.preferences ?? "");
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id]);

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!id) return;

    try {
      setIsSaving(true);

      await clientsApi.update(Number(id), {
        name,
        email,
        preferences,
      });

      navigate(`/clients/${id}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
      >
        Loading...
      </Flex>
    );
  }

  if (!client) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
      >
        Client not found
      </Flex>
    );
  }

  return (
    <Box maxW="800px" mx="auto">
      <Flex
        justify="space-between"
        align="center"
        mb={6}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            navigate(`/clients/${id}`)
          }
        >
          <LuArrowLeft />
          Back to client
        </Button>

        <Heading size="lg">
          Edit client
        </Heading>
      </Flex>

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
                  placeholder="Client name"
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
                  placeholder="client@email.com"
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
                      e.target.value
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
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/clients/${id}`
                    )
                  }
                  type="button"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  colorPalette="brand"
                  loading={isSaving}
                >
                  <LuSave />
                  Save changes
                </Button>
              </Flex>
            </Flex>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}