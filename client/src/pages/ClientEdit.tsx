import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Text } from "@chakra-ui/react";

import type { Client } from "@/types/client";
import { clientsApi } from "@/api/clients";
import type { ClientFormData } from "@/components/ClientForm";
import ClientForm from "@/components/ClientForm";



export default function ClientEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [client, setClient] =
    useState<Client | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const loadClient = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const data =
          await clientsApi.getById(
            Number(id),
          );

        setClient(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadClient();
  }, [id]);

  const handleSubmit = async (
    data: ClientFormData,
  ) => {
    if (!id) return;

    try {
      setIsSaving(true);

      await clientsApi.update(
        Number(id),
        {
          name: data.name,
          email:
            data.email || undefined,
          preferences:
            data.preferences ||
            undefined,
        },
      );

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
        <Text>Loading...</Text>
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
        <Text>Client not found</Text>
      </Flex>
    );
  }

  return (
    <ClientForm
      title="Edit client"
      submitLabel="Save changes"
      isSaving={isSaving}
      initialValues={{
        name: client.name ?? "",
        email: client.email ?? "",
        preferences:
          client.preferences ?? "",
      }}
      onBack={() =>
        navigate(`/clients/${id}`)
      }
      onSubmit={handleSubmit}
    />
  );
}