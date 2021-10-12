import React from "react";

import { setupProject } from "./project-setup";
import App from "./App";

// Renders the web-app/extension content to DOM.
setupProject({
  rootElement: (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  ),
  injectExtensionTo: "body",
});
