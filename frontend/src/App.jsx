import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Header from "./components/Header.jsx";
import Chatbot from "./components/Chatbot.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AuthRedirect from "./components/AuthRedirect.jsx";
import LoginRedirect from "./components/LoginRedirect.jsx";
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
  const token = localStorage.getItem("agriseva_token");
  const isLogin = location.pathname === "/login";
  const [navOpen, setNavOpen] = useState(false);

  // Always show login when not authenticated (no token) — don't rely on route order
  if (!token && !isLogin) {
    return <Navigate to="/login" replace />;
  }

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
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/" element={<AuthRedirect />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/prices"
              element={
                <ProtectedRoute>
                  <PriceForecast />
                </ProtectedRoute>
              }
            />
            <Route
              path="/weather"
              element={
                <ProtectedRoute>
                  <WeatherAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ndvi"
              element={
                <ProtectedRoute>
                  <CropHealthMap />
                </ProtectedRoute>
              }
            />
            <Route
              path="/auction"
              element={
                <ProtectedRoute>
                  <AuctionListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <ProtectedRoute>
                  <Feedback />
                </ProtectedRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Payments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ngo-volunteering"
              element={
                <ProtectedRoute>
                  <NgoVolunteering />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ads"
              element={
                <ProtectedRoute>
                  <Ads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/premium"
              element={
                <ProtectedRoute>
                  <Premium />
                </ProtectedRoute>
              }
            />
            <Route path="/founders" element={<Founders />} />
            <Route
              path="/gps"
              element={
                <ProtectedRoute>
                  <GpsLocator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/mandi-compare"
              element={
                <ProtectedRoute>
                  <MandiCompare />
                </ProtectedRoute>
              }
            />
            <Route
              path="/smart-alerts"
              element={
                <ProtectedRoute>
                  <SmartAlerts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crop-calendar"
              element={
                <ProtectedRoute>
                  <CropCalendar />
                </ProtectedRoute>
              }
            />
            <Route
              path="/soil-advisory"
              element={
                <ProtectedRoute>
                  <SoilAdvisory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transport-pooling"
              element={
                <ProtectedRoute>
                  <TransportPooling />
                </ProtectedRoute>
              }
            />
            <Route
              path="/credit-insurance"
              element={
                <ProtectedRoute>
                  <CreditInsurance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/traceability"
              element={
                <ProtectedRoute>
                  <TraceabilityQR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/grievance"
              element={
                <ProtectedRoute>
                  <Grievance />
                </ProtectedRoute>
              }
            />
            {/* Catch-all: unauthenticated users already redirected in App; others go to dashboard */}
            <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} replace />} />
          </Routes>
        </main>
        {!isLogin && <Chatbot />}
      </div>
    </div>
  );
}
