import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/navbar";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

import Vehicles from "./pages/vehicle/Vehicles";
import VehicleDetails from "./pages/VehicleDetails";
import VehicleCreate from "./pages/vehicle/VehicleCreate";
import VehicleEdit from "./pages/vehicle/VechicleEdit";

import Sales from "./pages/sales/Sales";
import SaleDetails from "./pages/sales/SaleDetails";
import SaleCreate from "./pages/sales/SaleCreate";
import SaleEdit from "./pages/sales/SaleEdit";

import Clients from "./pages/clients/Clients";
import ClientDetails from "./pages/clients/ClientDetails";
import ClientCreate from "./pages/clients/CreateClient";
import ClientEdit from "./pages/clients/ClientEdit";

import Personnel from "./pages/personnel/Personnel";
import PersonnelDetails from "./components/PersonnelDetails";
import PersonnelCreate from "./pages/personnel/PersonnelCreate";
import PersonnelEdit from "./pages/personnel/PersonnelEdit";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={<Auth />}
        />

        {/* Main */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =========================
            Vehicles
        ========================= */}

        <Route
          path="/vehicles"
          element={<Vehicles />}
        />

        <Route
          path="/vehicles/new"
          element={<VehicleCreate />}
        />

        <Route
          path="/vehicles/:id"
          element={<VehicleDetails />}
        />

        <Route
          path="/vehicles/:id/edit"
          element={<VehicleEdit />}
        />

        {/* =========================
            Sales
        ========================= */}

        <Route
          path="/sales"
          element={<Sales />}
        />

        <Route
          path="/sales/new"
          element={<SaleCreate />}
        />

        <Route
          path="/sales/:id"
          element={<SaleDetails />}
        />

        <Route
          path="/sales/:id/edit"
          element={<SaleEdit />}
        />

        {/* =========================
            Clients
        ========================= */}

        <Route
          path="/clients"
          element={<Clients />}
        />

        <Route
          path="/clients/new"
          element={<ClientCreate />}
        />

        <Route
          path="/clients/:id"
          element={<ClientDetails />}
        />

        <Route
          path="/clients/:id/edit"
          element={<ClientEdit />}
        />

        {/* =========================
            Personnel
        ========================= */}

        <Route
          path="/personnel"
          element={<Personnel />}
        />

        <Route
          path="/personnel/create"
          element={<PersonnelCreate />}
        />

        <Route
          path="/personnel/:id"
          element={<PersonnelDetails />}
        />

        <Route
          path="/personnel/:id/edit"
          element={<PersonnelEdit />}
        />
      </Routes>

      <ScrollToTopButton />
    </>
  );
}

export default App;