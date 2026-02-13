 import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Header from "./components/Header.jsx";
import Chatbot from "./components/Chatbot.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import PriceForecast from "./pages/PriceForecast.jsx";
import WeatherAlerts from "./pages/WeatherAlerts.jsx";
import CropHealthMap from "./pages/CropHealthMap.jsx";
import AuctionListings from "./pages/AuctionListings.jsx";
import Feedback from "./pages/Feedback.jsx";
import About from "./pages/About.jsx";
import Payments from "./pages/Payments.jsx";
import NgoVolunteering from "./pages/NgoVolunteering.jsx";
import Ads from "./pages/Ads.jsx";
import Premium from "./pages/Premium.jsx";
import Founders from "./pages/Founders.jsx";
import GpsLocator from "./pages/GpsLocator.jsx";
import MandiCompare from "./pages/MandiCompare.jsx";
import SmartAlerts from "./pages/SmartAlerts.jsx";
import CropCalendar from "./pages/CropCalendar.jsx";
import SoilAdvisory from "./pages/SoilAdvisory.jsx";
import TransportPooling from "./pages/TransportPooling.jsx";
import CreditInsurance from "./pages/CreditInsurance.jsx";
import TraceabilityQR from "./pages/TraceabilityQR.jsx";
import Grievance from "./pages/Grievance.jsx";

export default function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className={isLogin ? "login-shell" : "app-shell app-bg"}>
      {!isLogin && (
        <>
          <div
            className={`sidebar-backdrop ${navOpen ? "sidebar-backdrop-visible" : ""}`}
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <Nav isOpen={navOpen} onClose={() => setNavOpen(false)} />
        </>
      )}
      <div className="main-area">
        {!isLogin && <Header onMenuClick={() => setNavOpen((v) => !v)} />}
        <main className={isLogin ? "login-page" : "page"}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/prices" element={<PriceForecast />} />
            <Route path="/weather" element={<WeatherAlerts />} />
            <Route path="/ndvi" element={<CropHealthMap />} />
            <Route path="/auction" element={<AuctionListings />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/about" element={<About />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/ngo-volunteering" element={<NgoVolunteering />} />
            <Route path="/ads" element={<Ads />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/founders" element={<Founders />} />
            <Route path="/gps" element={<GpsLocator />} />
            <Route path="/mandi-compare" element={<MandiCompare />} />
            <Route path="/smart-alerts" element={<SmartAlerts />} />
            <Route path="/crop-calendar" element={<CropCalendar />} />
            <Route path="/soil-advisory" element={<SoilAdvisory />} />
            <Route path="/transport-pooling" element={<TransportPooling />} />
            <Route path="/credit-insurance" element={<CreditInsurance />} />
            <Route path="/traceability" element={<TraceabilityQR />} />
            <Route path="/grievance" element={<Grievance />} />
          </Routes>
        </main>
        {!isLogin && <Chatbot />}
      </div>
    </div>
  );
}
