import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { salesApi } from "@/api/sales";
import { vehiclesApi } from "@/api/vehicles";
import { clientsApi } from "@/api/clients";
import type { SaleFormData } from "@/components/SalesFrom";
import SaleForm from "@/components/SalesFrom";



export default function SaleCreate() {
  const navigate = useNavigate();

  const [vehicles, setVehicles] =
    useState<
      { id: number | string; label: string }[]
    >([]);

  const [clients, setClients] =
    useState<
      { id: number | string; label: string }[]
    >([]);

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

        setVehicles(
          vehicleData.map((vehicle) => ({
            id: vehicle.id,
            label: `${vehicle.brand} ${vehicle.model}`,
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
    
    <SaleForm
      title="Add sale"
      submitLabel="Create sale"
      isSaving={isSaving}
      vehicles={vehicles}
      clients={clients}
      onBack={() => navigate("/sales")}
      onSubmit={handleSubmit}
    />
  );
}