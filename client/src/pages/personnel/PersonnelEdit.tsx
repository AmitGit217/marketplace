import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";


import {
  usersApi,
  type UpdateUserData,
} from "@/api/users";

import type { User } from "@/types/user";
import type { PersonnelFormData } from "@/components/PersonnelForm";
import PersonnelForm from "@/components/PersonnelForm";

export default function PersonnelEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [personnel, setPersonnel] =
    useState<User | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const loadPersonnel = async () => {
      if (!id) return;

      try {
        const data = await usersApi.getById(Number(id));
        setPersonnel(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPersonnel();
  }, [id]);

  const handleSubmit = async (data: PersonnelFormData) => {
    if (!id) return;

    setIsSaving(true);

    try {
      const payload: UpdateUserData = {
        name: data.name,
        email: data.email,
        role: data.role,
        preferences: data.preferences || undefined,
      };

      if (data.password) {
        payload.password = data.password;
      }

      await usersApi.update(Number(id), payload);

      navigate("/personnel");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !personnel) {
    return null;
  }

  return (
    <PersonnelForm
      initialData={{
        name: personnel.name,
        email: personnel.email,
        role: personnel.role,
        preferences: personnel.preferences ?? "",
      }}
      onSubmit={handleSubmit}
      isEdit
      isLoading={isSaving}
    />
  );
}