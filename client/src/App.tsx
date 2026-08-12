import { Routes, Route } from "react-router-dom";
import Navbar from "./components/ui/navbar";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;