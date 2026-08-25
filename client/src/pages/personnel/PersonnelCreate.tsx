import { useState } from "react";
import { useNavigate } from "react-router-dom";


import {
  usersApi,
  type CreateUserData,
} from "@/api/users";
import type { PersonnelFormData } from "@/components/PersonnelForm";
import PersonnelForm from "@/components/PersonnelForm";

export default function PersonnelCreate() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PersonnelFormData) => {
    setIsLoading(true);

    try {
      const payload: CreateUserData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        preferences: data.preferences || undefined,
      };

      await usersApi.create(payload);

      navigate("/personnel");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PersonnelForm
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}