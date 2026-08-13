import { Routes, Route } from "react-router-dom";

import Navbar from "./components/ui/navbar";

import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Vehicles from "./pages/vehicles";


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
      </Routes>
    </>
  );
}

export default App;