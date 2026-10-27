import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import EntranceLoader from "./components/entrance-loader";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EntranceLoader>
      <App />
    </EntranceLoader>
  </StrictMode>,
);
