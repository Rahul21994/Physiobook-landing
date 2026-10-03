import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { GetNapResponse } from "@workspace/api-zod";
import { BUSINESS_CONFIG } from "../src/config/business";

const siteRoot = path.resolve(import.meta.dirname, "..");
const apiRoot = path.resolve(siteRoot, "..", "api-server");
const outputPaths = [
  path.join(siteRoot, "src", "lib", "nap.generated.json"),
  path.join(apiRoot, "src", "lib", "nap.generated.json"),
];
const address = BUSINESS_CONFIG.headOffice.address;
let nap: ReturnType<typeof GetNapResponse.parse>;
try {
  nap = GetNapResponse.parse({
    name: BUSINESS_CONFIG.name,
    ...(BUSINESS_CONFIG.contact.phone
      ? { telephone: BUSINESS_CONFIG.contact.phone }
      : {}),
    mapUrl: BUSINESS_CONFIG.headOffice.googleMapsUrl,
    address: {
      streetAddress: address.streetAddress,
      addressLocality: address.addressLocality,
      addressRegion: address.addressRegion,
      postalCode: address.postalCode,
      addressCountry: address.addressCountry,
      displayLine: address.localityLine,
    },
  });
} catch (error) {
  throw new Error("Central business configuration is invalid for public NAP.", { cause: error });
}

for (const outputPath of outputPaths) {
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(nap, null, 2)}\n`, "utf8");
}