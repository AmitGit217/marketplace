import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Sale } from "@/types/sale";
import { salesApi } from "@/api/sales";

import {
  ManagementTable,
  type TableColumn,
} from "@/components/management/ManagementTable";

const formatDateValue = (value: unknown): string => {
  if (value === null || value === undefined) {
    return "-";
  }

  const dateValue =
    value instanceof Date
      ? value
      : typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null;

  return dateValue && !isNaN(dateValue.getTime())
    ? dateValue.toLocaleDateString()
    : "-";
};

const saleColumns: TableColumn<Sale>[] = [
  {
    key: "id",
    label: "Sale ID",
  },
  {
    key: "vehicleId",
    label: "Vehicle",
    render: (_, row) =>
      row.vehicle
        ? `${row.vehicle.brand} ${row.vehicle.model}`
        : row.vehicleId,
  },
  {
    key: "clientId",
    label: "Client",
    render: (_, row) =>
      row.client?.name ?? `Client #${row.clientId}`,
  },
  {
    key: "saleDate",
    label: "Sale date",
    render: (value) => formatDateValue(value),
  },
  {
    key: "paymentMethod",
    label: "Payment",
  },
  {
    key: "deliveryDate",
    label: "Delivery",
    render: (value) => formatDateValue(value),
  },
];

export default function Sales() {
  const navigate = useNavigate();

  const [sales, setSales] =
    useState<Sale[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data =
          await salesApi.getAll();

        setSales(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, []);

  return (
    <ManagementTable
      data={sales}
      columns={saleColumns}
      isLoading={isLoading}
      onRowClick={(sale) =>
        navigate(`/sales/${sale.id}`)
      }
    />
  );
}