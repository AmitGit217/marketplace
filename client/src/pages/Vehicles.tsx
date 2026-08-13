import { useEffect, useState } from "react";

import type { Vehicle } from "@/types/vehicle";
import {
  ManagementTable,
  type TableColumn,
} from "@/components/management/managementTable";
import { vehiclesApi } from "@/api/vehicles";

const vehicleColumns: TableColumn<Vehicle>[] = [
  {
    key: "brand",
    label: "Brand",
  },
  {
    key: "model",
    label: "Model",
  },
  {
    key: "type",
    label: "Type",
  },
  {
    key: "manufactureYear",
    label: "Year",
  },
  {
    key: "mileage",
    label: "Mileage",
    render: (value) =>
      `${value.toLocaleString()} km`,
  },
  {
    key: "price",
    label: "Price",
    render: (value) =>
      `€${Number(value).toLocaleString()}`,
  },
  {
    key: "status",
    label: "Status",
  },
];

export default function Vehicles() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await vehiclesApi.getAll();
        setVehicles(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  return (
    <ManagementTable
      data={vehicles}
      columns={vehicleColumns}
      isLoading={isLoading}
    />
  );
}