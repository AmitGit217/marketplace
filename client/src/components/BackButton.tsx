import { Button } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useLocation, useNavigate } from "react-router-dom";

interface BackButtonProps {
  fallback?: string;
  label?: string;
}

export default function BackButton({
  fallback = "/dashboard",
  label = "Back",
}: BackButtonProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    const path = location.pathname;

    const rootRoutes = [
      "/vehicles",
      "/sales",
      "/clients",
      "/personnel",
    ];

    if (rootRoutes.includes(path)) {
      navigate("/dashboard", { replace: true });
      return;
    }

    navigate(fallback, { replace: true });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleBack}
    >
      <LuArrowLeft />
      {label}
    </Button>
  );
}