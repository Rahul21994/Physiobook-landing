import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { installPendingBookingModeClickCapture } from "./lib/booking-link-capture";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("The application root element is missing.");
}

installPendingBookingModeClickCapture(document);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, <App />);
} else {
  createRoot(rootElement).render(<App />);
}

document.documentElement.dataset.hydrationReady = "true";