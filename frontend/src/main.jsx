import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./styles.css";
import "leaflet/dist/leaflet.css";
import { LanguageProvider } from "./i18n.jsx";

// Match Vite base so routes (/, /login, /dashboard) work on GitHub Pages and locally
const basename = (import.meta.env.BASE_URL || "/").replace(/\/$/, "") || "/";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
