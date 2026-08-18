import { useParams } from "react-router-dom";

export default function VehicleDetails() {
  const { id } = useParams();

  return (
    <div>
      Vehicle ID: {id}
    </div>
  );
}