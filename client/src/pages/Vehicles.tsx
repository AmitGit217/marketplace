import { ManagementTable, type TableColumn } from "@/components/management/ManagementTable";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  type: string;
  manufactureYear: number;
  mileage: number;
  price: number;
  status: string;
}

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
    render: (value) => `${value.toLocaleString()} km`,
  },
  {
    key: "price",
    label: "Price",
    render: (value) => `€${value.toLocaleString()}`,
  },
  {
    key: "status",
    label: "Status",
  },
];

export default function Vehicles() {
  const vehicles: Vehicle[] = [
    {
      id: "1",
      brand: "BMW",
      model: "M3",
      type: "Sedan",
      manufactureYear: 2023,
      mileage: 12000,
      price: 65000,
      status: "available",
    },
    {
      id: "2",
      brand: "Mercedes",
      model: "C-Class",
      type: "Sedan",
      manufactureYear: 2024,
      mileage: 8500,
      price: 58000,
      status: "available",
    },
    {
      id: "3",
      brand: "Audi",
      model: "RS5",
      type: "Coupe",
      manufactureYear: 2022,
      mileage: 21000,
      price: 72000,
      status: "sold",
    },
  ];

  return (
    <ManagementTable
      data={vehicles}
      columns={vehicleColumns}
    />
  );
}