import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import "@asafarim/country-language-selector/styles.css";
import "./styles.css";
import { setupI18n } from "./i18n";
import App from "./App";

setupI18n();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);
