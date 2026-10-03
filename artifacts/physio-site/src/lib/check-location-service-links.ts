import {
  checkLocationServiceSources,
  formatLocationServiceLinkResult,
} from "./location-service-link-health.js";
import { getLocationServiceSources } from "./location-services.js";

export async function runLocationServiceLinkHealthCheck(): Promise<number> {
  const sources = getLocationServiceSources();
  const results = await checkLocationServiceSources(sources);
  const broken = results.filter((result) => result.state === "broken");
  const unverified = results.filter((result) => result.state === "unverified");
  const verified = results.filter((result) => result.state === "verified");

  if (broken.length > 0) {
    console.error(
      `Location service source check found ${broken.length} broken source${broken.length === 1 ? "" : "s"}.`,
    );
    for (const result of broken) {
      console.error(`Broken source: ${formatLocationServiceLinkResult(result)}`);
    }
  }

  for (const result of unverified) {
    console.warn(`Unverified source: ${formatLocationServiceLinkResult(result)}`);
  }

  console.log(
    `Location service source check complete: ${sources.length} sources checked (${verified.length} verified, ${unverified.length} unverified, ${broken.length} broken).`,
  );
  return broken.length > 0 ? 1 : 0;
}

runLocationServiceLinkHealthCheck()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    console.error("Location service source check could not complete:", error);
    process.exitCode = 1;
  });
