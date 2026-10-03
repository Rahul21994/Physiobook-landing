import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const bookingSource = readFileSync(
  fileURLToPath(new URL("../src/pages/booking.tsx", import.meta.url)),
  "utf8",
);

assert.match(
  bookingSource,
  /const BUSINESS_UPI_ID = "7976044858@upi";/,
  "Booking confirmation should use the registered business UPI VPA",
);
assert.match(
  bookingSource,
  /pa=\$\{BUSINESS_UPI_ID\}/,
  "UPI deep link should route to the configured business VPA",
);
assert.match(
  bookingSource,
  /<QRCodeSVG[\s\S]*value=\{upiLink\}/,
  "Booking confirmation QR should be generated from the booking UPI deep link",
);
assert.doesNotMatch(
  bookingSource,
  /payment-qr\.jpg/,
  "Booking confirmation should not use a stale static payment QR",
);

console.log("UPI payment configuration check passed.");