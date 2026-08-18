import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/navbar";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import VehicleDetails from "./pages/VehicleDetails";
import Vehicles from "./pages/Vehicles";
import Sales from "./pages/Sales";
import SaleDetails from "./components/SaleDetails";
import Clients from "./pages/Clients";
import ClientDetails from "./components/ClientDetails";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Auth />} />

        {/* Main */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Management */}
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/sales" element={<Sales />} />
        <Route
  path="/clients"
  element={<Clients />}
/>




        {/* Details */}
        <Route
        path="/vehicles/:id"
        element={<VehicleDetails />}
      />
      <Route path="/sales/:id" element={<SaleDetails />} />
      <Route
  path="/clients/:id"
  element={<ClientDetails />}
/>

      </Routes>

      <ScrollToTopButton />
    </>
  );
}

export default App;