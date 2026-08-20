import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { clientsApi } from "@/api/clients";
import type { ClientFormData } from "../components/ClientForm";
import ClientForm from "../components/ClientForm";


export default function ClientCreate() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] =
    useState(false);

  const handleSubmit = async (
    data: ClientFormData,
  ) => {
    try {
      setIsSaving(true);

      const client =
        await clientsApi.create({
          name: data.name,
          email:
            data.email || undefined,
          preferences:
            data.preferences || undefined,
        });

      navigate(`/clients/${client.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ClientForm
      title="Add client"
      submitLabel="Create client"
      isSaving={isSaving}
      onBack={() => navigate("/clients")}
      onSubmit={handleSubmit}
    />
  );
}