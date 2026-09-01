import { Button, Container } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

import Navbar from "./components/ui/navbar";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

// Vehicles
import Vehicles from "./pages/vehicle/Vehicles";
import VehicleCreate from "./pages/vehicle/VehicleCreate";
import VehicleEdit from "./pages/vehicle/VechicleEdit";
import VehicleDetails from "./pages/vehicle/VehicleDetails";

// Sales
import Sales from "./pages/sales/Sales";
import SaleCreate from "./pages/sales/SaleCreate";
import SaleEdit from "./pages/sales/SaleEdit";
import SaleDetails from "./pages/sales/SaleDetails";

// Clients
import Clients from "./pages/clients/Clients";
import ClientCreate from "./pages/clients/CreateClient";
import ClientEdit from "./pages/clients/ClientEdit";
import ClientDetails from "./pages/clients/ClientDetails";

// Personnel
import Personnel from "./pages/personnel/Personnel";
import PersonnelCreate from "./pages/personnel/PersonnelCreate";
import PersonnelEdit from "./pages/personnel/PersonnelEdit";
import PersonnelDetails from "./components/PersonnelDetails";

/* -------------------------------------------------------------------------- */
/* Routes                                                                     */
/* -------------------------------------------------------------------------- */

export const ROUTES = {
  home: "/",
  dashboard: "/dashboard",
  profile: "/profile",

  vehicles: "/vehicles",
  vehicleNew: "/vehicles/new",
  vehicle: (id: string | number) => `/vehicles/${id}`,
  vehicleEdit: (id: string | number) => `/vehicles/${id}/edit`,

  sales: "/sales",
  saleNew: "/sales/new",
  sale: (id: string | number) => `/sales/${id}`,
  saleEdit: (id: string | number) => `/sales/${id}/edit`,

  clients: "/clients",
  clientNew: "/clients/new",
  client: (id: string | number) => `/clients/${id}`,
  clientEdit: (id: string | number) => `/clients/${id}/edit`,

  personnel: "/personnel",
  personnelNew: "/personnel/new",
  personnelDetail: (id: string | number) => `/personnel/${id}`,
  personnelEdit: (id: string | number) => `/personnel/${id}/edit`,
} as const;

/* -------------------------------------------------------------------------- */
/* Back Button                                                                */
/* -------------------------------------------------------------------------- */

const ROOT_ROUTES = new Set<string>([
  ROUTES.vehicles,
  ROUTES.sales,
  ROUTES.clients,
  ROUTES.personnel as unknown as string,
  ROUTES.profile,
]);

function BackButton() {
  const location = useLocation();
  const navigate = useNavigate();

  if (!ROOT_ROUTES.has(location.pathname)) {
    return null;
  }

  return (
    <Container
      maxW="7xl"
      px={{ base: 4, md: 6 }}
      pt={3}
      pb={2}
    >
      <Button
        onClick={() => navigate(ROUTES.dashboard, { replace: true })}
        variant="ghost"
        size="sm"
        borderRadius="lg"
        color="fg.muted"
        _hover={{
          color: "fg",
          bg: "bg.muted",
        }}
      >
        <LuArrowLeft />
        Back
      </Button>
    </Container>
  );
}

/* -------------------------------------------------------------------------- */
/* App                                                                        */
/* -------------------------------------------------------------------------- */

function App() {
  return (
    <>
      <Navbar />

      <BackButton />

      <Routes>
        {/* Public */}
        <Route path={ROUTES.home} element={<Auth />} />

        {/* Main */}
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.profile} element={<Profile />} />

        {/* Vehicles */}
        <Route path={ROUTES.vehicles} element={<Vehicles />} />
        <Route path={ROUTES.vehicleNew} element={<VehicleCreate />} />
        <Route path="/vehicles/:id" element={<VehicleDetails />} />
        <Route path="/vehicles/:id/edit" element={<VehicleEdit />} />

        {/* Sales */}
        <Route path={ROUTES.sales} element={<Sales />} />
        <Route path={ROUTES.saleNew} element={<SaleCreate />} />
        <Route path="/sales/:id" element={<SaleDetails />} />
        <Route path="/sales/:id/edit" element={<SaleEdit />} />

        {/* Clients */}
        <Route path={ROUTES.clients} element={<Clients />} />
        <Route path={ROUTES.clientNew} element={<ClientCreate />} />
        <Route path="/clients/:id" element={<ClientDetails />} />
        <Route path="/clients/:id/edit" element={<ClientEdit />} />

        {/* Personnel */}
        <Route path={ROUTES.personnel} element={<Personnel />} />
        <Route path={ROUTES.personnelNew} element={<PersonnelCreate />} />
        <Route path="/personnel/:id" element={<PersonnelDetails />} />
        <Route path="/personnel/:id/edit" element={<PersonnelEdit />} />

        {/* Unknown route */}
        <Route
          path="*"
          element={<Navigate to={ROUTES.dashboard} replace />}
        />
      </Routes>

      <ScrollToTopButton />
    </>
  );
}

export default App;