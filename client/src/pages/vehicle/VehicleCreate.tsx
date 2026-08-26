import { useNavigate } from "react-router-dom";

import type { Vehicle } from "@/types/vehicle";
import VehicleForm from "@/components/VehicleForm";

export default function VehicleCreate() {
  const navigate = useNavigate();

  const handleSaved = (vehicle: Vehicle) => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <VehicleForm
      mode="create"
      onCancel={() => navigate("/vehicles")}
      onSaved={handleSaved}
    />
  );
}