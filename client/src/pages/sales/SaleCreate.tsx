import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { salesApi } from "@/api/sales";
import { vehiclesApi } from "@/api/vehicles";
import { clientsApi } from "@/api/clients";

import type { SaleFormData } from "@/components/SalesFrom";
import SaleForm from "@/components/SalesFrom";
import { Box } from "@chakra-ui/react";

interface VehicleOption {
  id: string;
  brand: string;
  model: string;
  type: string;
  manufactureYear: number;
  mileage: number;
  condition: string;
  price: number;
  status: string;
  image: string;
  color: string;
}

interface ClientOption {
  id: number;
  label: string;
}

export default function SaleCreate() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState<VehicleOption[]>([]);

  const [clients, setClients] =
    useState<ClientOption[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehicleData, clientData] =
          await Promise.all([
            vehiclesApi.getAll(),
            clientsApi.getAll(),
          ]);

        // Only vehicles available for sale
        const availableVehicles =
          vehicleData
            .filter(
              (vehicle) =>
                vehicle.status === "Available",
            )
            .sort(
              (a, b) =>
                b.manufactureYear -
                a.manufactureYear,
            );

        setVehicles(
          availableVehicles.map((vehicle) => ({
            ...vehicle,
            price: Number(vehicle.price),
          })),
        );

        setClients(
          clientData.map((client) => ({
            id: client.id,
            label: client.name,
          })),
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (
    data: SaleFormData,
  ) => {
    try {
      setIsSaving(true);

      const sale =
        await salesApi.create({
          vehicleId: data.vehicleId,
          clientId: Number(data.clientId),
          saleDate: data.saleDate,
          paymentMethod: data.paymentMethod,
          deliveryDate: data.deliveryDate,
        });

      navigate(`/sales/${sale.id}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

return (
  <Box
    minH="100vh"
    display="flex"
    alignItems="center"
    justifyContent="center"
    px={4}
    py={8}
  >
    <SaleForm
      title="Create Sale"
      submitLabel="Complete Sale"
      isSaving={isSaving}
      vehicles={vehicles}
      clients={clients}
      onBack={() => navigate("/sales")}
      onSubmit={handleSubmit}
    />
  </Box>
);
}