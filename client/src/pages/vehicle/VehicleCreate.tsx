import { useNavigate } from "react-router-dom";

import type { Vehicle } from "@/types/vehicle";
import VehicleForm from "@/components/VehicleForm";
import { ROUTES } from "@/utils/consts";

export default function VehicleCreate() {
  const navigate = useNavigate();

  const handleSaved = (vehicle: Vehicle) => {
    navigate(ROUTES.vehicle(vehicle.id));
  };

  return (
    <VehicleForm
      mode="create"
      onCancel={() => navigate(ROUTES.vehicles)}
      onSaved={handleSaved}
    />
  );
}