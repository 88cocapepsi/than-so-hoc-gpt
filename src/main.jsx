import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function applyBaseBodySetup() {
  const body = document.body;
  const root = document.documentElement;

  body.style.margin = "0";
  body.style.minWidth = "320px";
  body.style.minHeight = "100vh";
  body.style.overflowX = "hidden";
  body.style.webkitTapHighlightColor = "transparent";

  root.style.minHeight = "100%";
  body.classList.add("theme-dark");
}

function syncThemeClass() {
  const saved =
    JSON.parse(localStorage.getItem("than_so_hoc_gpt_settings_v6") || "{}") || {};
  const mode = saved.themeMode === "light" ? "light" : "dark";

  document.body.classList.remove("theme-light", "theme-dark");
  document.body.classList.add(mode === "light" ? "theme-light" : "theme-dark");
}

applyBaseBodySetup();
syncThemeClass();

window.addEventListener("storage", (event) => {
  if (event.key === "than_so_hoc_gpt_settings_v6") {
    syncThemeClass();
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
