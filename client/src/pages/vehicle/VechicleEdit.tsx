import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Center,
} from "@chakra-ui/react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";

import type { Vehicle } from "@/types/vehicle";
import { vehiclesApi } from "@/api/vehicles";
import VehicleForm from "@/components/VehicleForm";

export default function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle, setVehicle] =
    useState<Vehicle | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    if (!id) return;

    const loadVehicle = async () => {
      try {
        const data =
          await vehiclesApi.getById(id);

        setVehicle(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicle();
  }, [id]);

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!vehicle) {
    return (
      <Box>
        Vehicle not found.
      </Box>
    );
  }

  return (
    <VehicleForm
      mode="edit"
      vehicle={vehicle}
      onCancel={() =>
        navigate(`/vehicles/${vehicle.id}`)
      }
      onSaved={(updatedVehicle) => {
        setVehicle(updatedVehicle);
        navigate(
          `/vehicles/${updatedVehicle.id}`
        );
      }}
    />
  );
}