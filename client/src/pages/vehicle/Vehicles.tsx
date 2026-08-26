import { useEffect, useState } from "react";
import { Button, Flex } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import type { Vehicle } from "@/types/vehicle";

import { vehiclesApi } from "@/api/vehicles";
import {
  ManagementTable,
  type TableColumn,
} from "@/components/management/ManagementTable";

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
  const navigate = useNavigate();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await vehiclesApi.getAll();
        setVehicles(data);
      } catch (error) {
        console.error(
          "Failed to load vehicles:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  return (
    <Flex direction="column" gap={4}>
      <Flex justify="flex-end">
        <Button
          onClick={() =>
            navigate("/vehicles/new")
          }
        >
          <LuPlus />
          Create Vehicle
        </Button>
      </Flex>

      <ManagementTable
        data={vehicles}
        columns={vehicleColumns}
        isLoading={isLoading}
        onRowClick={(vehicle) =>
          navigate(`/vehicles/${vehicle.id}`)
        }
      />
    </Flex>
  );
}