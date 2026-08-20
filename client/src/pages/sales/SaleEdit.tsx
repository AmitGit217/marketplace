import { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";

import { salesApi } from "@/api/sales";
import { vehiclesApi } from "@/api/vehicles";
import { clientsApi } from "@/api/clients";

import type { Sale } from "@/types/sale";
import type { SaleFormData } from "@/components/SalesFrom";
import SaleForm from "@/components/SalesFrom";



export default function SaleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] =
    useState<Sale | null>(null);

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
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const [
          saleData,
          vehicleData,
          clientData,
        ] = await Promise.all([
          salesApi.getById(Number(id)),
          vehiclesApi.getAll(),
          clientsApi.getAll(),
        ]);

        setSale(saleData);

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
  }, [id]);

  const handleSubmit = async (
    data: SaleFormData,
  ) => {
    if (!id) return;

    try {
      setIsSaving(true);

      await salesApi.update(
        Number(id),
        {
          vehicleId: data.vehicleId,
          clientId: Number(
            data.clientId,
          ),
          saleDate: data.saleDate,
          paymentMethod:
            data.paymentMethod,
          deliveryDate:
            data.deliveryDate,
        },
      );

      navigate(`/sales/${id}`);
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

  if (!sale) {
    return (
      <Flex
        minH="400px"
        align="center"
        justify="center"
      >
        <Text>Sale not found</Text>
      </Flex>
    );
  }

  return (
    <SaleForm
      title="Edit sale"
      submitLabel="Save changes"
      isSaving={isSaving}
      vehicles={vehicles}
      clients={clients}
      initialValues={{
        vehicleId: String(
          sale.vehicleId,
        ),
        clientId: String(
          sale.clientId,
        ),
        saleDate:
          sale.saleDate.slice(0, 10),
        paymentMethod:
          sale.paymentMethod,
        deliveryDate:
          sale.deliveryDate.slice(0, 10),
      }}
      onBack={() =>
        navigate(`/sales/${id}`)
      }
      onSubmit={handleSubmit}
    />
  );
}