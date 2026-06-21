import React from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@fontsource-variable/newsreader/index.css";
import "@fontsource-variable/public-sans/index.css";
import "./index.css";

const container = document.getElementById("root") as HTMLElement;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Prerendered HTML present → hydrate; otherwise (dev / un-prerendered) render.
if (container.firstElementChild) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
