import { Routes, Route, Navigate } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Header from "./components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import PriceForecast from "./pages/PriceForecast.jsx";
import WeatherAlerts from "./pages/WeatherAlerts.jsx";
import CropHealthMap from "./pages/CropHealthMap.jsx";
import AuctionListings from "./pages/AuctionListings.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <Nav />
      <div className="main-area">
        <Header />
        <main className="page">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/prices" element={<PriceForecast />} />
            <Route path="/weather" element={<WeatherAlerts />} />
            <Route path="/ndvi" element={<CropHealthMap />} />
            <Route path="/auction" element={<AuctionListings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
