import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/navbar";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import VehicleDetails from "./pages/VehicleDetails";
import Vehicles from "./pages/Vehicles";
import Sales from "./pages/sales/Sales";
import SaleDetails from "./pages/sales/SaleDetails";
import Clients from "./pages/clients/Clients";
import ClientDetails from "./pages/clients/ClientDetails";
import Personnel from "./pages/personnel/Personnel";
import PersonnelDetails from "./components/PersonnelDetails";
import ClientEdit from "./pages/clients/ClientEdit";
import ClientCreate from "./pages/clients/CreateClient";
import SaleCreate from "./pages/sales/SaleCreate";
import SaleEdit from "./pages/sales/SaleEdit";
import PersonnelCreate from "./pages/personnel/PersonnelCreate";
import PersonnelEdit from "./pages/personnel/PersonnelEdit";

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



<Route
  path="/personnel"
  element={<Personnel />}
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

<Route
  path="/personnel/:id"
  element={<PersonnelDetails />}
/>

<Route
  path="/clients/:id/edit"
  element={<ClientEdit />}
/>

<Route
  path="/clients/new"
  element={<ClientCreate />}
/>
<Route
  path="/sales/new"
  element={<SaleCreate />}
/>

<Route
  path="/sales/:id/edit"
  element={<SaleEdit />}
/>

<Route
  path="/personnel"
  element={<Personnel />}
/>

<Route
  path="/personnel/create"
  element={<PersonnelCreate />}
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