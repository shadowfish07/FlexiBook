import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@arco-themes/react-flexibook/css/arco.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
