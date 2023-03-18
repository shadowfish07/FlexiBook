import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@arco-design/web-react/dist/css/arco.css";

export const SavingContext = React.createContext({
  isSaving: false,
  setIsSaving: (isSaving: boolean) => {},
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
