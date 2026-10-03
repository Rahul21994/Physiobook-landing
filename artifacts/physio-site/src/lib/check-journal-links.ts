import { runJournalLinkHealthCheck } from "./journal-link-health.js";

runJournalLinkHealthCheck()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error: unknown) => {
    console.error("Journal source link check could not complete:", error);
    process.exitCode = 1;
  });