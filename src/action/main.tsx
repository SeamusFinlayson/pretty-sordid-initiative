import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { PluginGate } from "../components/PluginGate";
import { PluginThemeProvider } from "../components/PluginThemeProvider";
import "../index.css";
import "./style.css";
import { handleSetRoundNumberMessage } from "../helpers/broadcastRoundImplementation";
import { updateRoundCount } from "../helpers/metadataHelpers";
import OBR from "@owlbear-rodeo/sdk";

OBR.onReady(() => {
  handleSetRoundNumberMessage((data) => {
    updateRoundCount(data.roundNumber, () => {});
  });
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <PluginGate>
      <PluginThemeProvider>
        <App />
      </PluginThemeProvider>
    </PluginGate>
  </React.StrictMode>,
);
