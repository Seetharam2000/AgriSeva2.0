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

export default function App() {
  const location = useLocation();
  const isLogin = location.pathname === "/login";

  return (
    <div className={isLogin ? "login-shell" : "app-shell app-bg"}>
      {!isLogin && <Nav />}
      <div className="main-area">
        {!isLogin && <Header />}
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
          </Routes>
        </main>
        {!isLogin && <Chatbot />}
      </div>
    </div>
  );
}
