import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { exposeNixBrowserLibraries } from "./playwright-runtime.mjs";

const siteDirectory = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);

async function getAvailablePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const address = probe.address();
  assert.ok(address && typeof address !== "string", "Could not determine a free port");
  const port = address.port;
  await new Promise((resolve, reject) => probe.close((error) => (error ? reject(error) : resolve())));
  return port;
}

async function waitForServer(server, url) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) throw new Error("Admin browser test server exited before becoming ready.");
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be binding its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Admin browser test server did not become ready.");
}

exposeNixBrowserLibraries();

const serverPort = await getAvailablePort();
const server = spawn(process.execPath, ["serve.mjs"], {
  cwd: siteDirectory,
  env: { ...process.env, PORT: String(serverPort) },
  stdio: ["ignore", "pipe", "pipe"],
});

let reviews = [
  {
    id: 101,
    name: "Pending Patient",
    city: "Jaipur",
    service: "Antenatal/postpartum physiotherapy",
    rating: 5,
    body: "A pending review that should show moderation actions and the full body.",
    status: "pending",
    createdAt: "2026-09-18T10:00:00.000Z",
  },
  {
    id: 102,
    name: "Approved Patient",
    city: "Delhi",
    rating: 4,
    body: "An approved review already visible to patients.",
    status: "approved",
    createdAt: "2026-09-17T10:00:00.000Z",
  },
  {
    id: 103,
    name: "Rejected Patient",
    city: null,
    rating: 2,
    body: "A rejected review that should remain identifiable without actions.",
    status: "rejected",
    createdAt: "2026-09-16T10:00:00.000Z",
  },
  {
    id: 104,
    name: "Second Pending Patient",
    city: "Noida",
    rating: 3,
    body: "A second pending review used to verify failed moderation feedback.",
    status: "pending",
    createdAt: "2026-09-15T10:00:00.000Z",
  },
];
let failNextMutation = false;
let adminFetches = 0;
let lastReviewMutationStatus = null;

let browser;
try {
  await waitForServer(server, `http://127.0.0.1:${serverPort}/admin`);
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.addInitScript(() => sessionStorage.setItem("admin_token", "browser-test-token"));
  await page.route("**/api/**", async (route) => {
    const request = route.request();
    const url = new URL(request.url());

    if (url.pathname === "/api/bookings" || url.pathname === "/api/contacts") {
      await route.fulfill({ status: 200, contentType: "application/json", body: "[]" });
      return;
    }

    if (url.pathname === "/api/reviews/admin" && request.method() === "GET") {
      adminFetches += 1;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(reviews) });
      return;
    }

    if (url.pathname.startsWith("/api/reviews/") && request.method() === "PATCH") {
      if (failNextMutation) {
        failNextMutation = false;
        lastReviewMutationStatus = 500;
        await route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify({ error: "Moderation service is temporarily unavailable." }),
        });
        return;
      }

      const id = Number(url.pathname.split("/").pop());
      const { status } = JSON.parse(request.postData() ?? "{}");
      const updated = reviews.find((review) => review.id === id);
      if (!updated) {
        lastReviewMutationStatus = 404;
        await route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ error: "Review not found" }),
        });
        return;
      }
      if (updated.status !== "pending") {
        lastReviewMutationStatus = 409;
        await route.fulfill({
          status: 409,
          contentType: "application/json",
          body: JSON.stringify({
            error: `Review is already ${updated.status} and cannot be changed.`,
            status: updated.status,
          }),
        });
        return;
      }

      const approved = { ...updated, status };
      reviews = reviews.map((review) => (review.id === id ? approved : review));
      lastReviewMutationStatus = 200;
      await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(approved) });
      return;
    }

    await route.continue();
  });

  await page.goto(`http://127.0.0.1:${serverPort}/admin`, { waitUntil: "domcontentloaded" });
  const reviewsTab = page.getByRole("button", { name: /^Reviews/ });
  await reviewsTab.waitFor({ state: "visible" });
  await reviewsTab.click();
  const reviewCard = (id) => page.locator(`[data-testid="admin-review-${id}"]`);
  const feedback = (type) => page.locator(`[data-testid="admin-review-${type}-feedback"]`);
  await page.waitForTimeout(500);
  assert.equal(await reviewCard(101).isVisible(), true, "The first pending review should be visible");

  const reviewCards = page.locator('[data-testid^="admin-review-"][data-review-status]');
  assert.equal(await reviewCards.count(), 4);
  assert.equal(await reviewCard(101).getAttribute("data-review-status"), "pending");
  assert.equal(await reviewCard(102).getAttribute("data-review-status"), "approved");
  assert.equal(await reviewCard(103).getAttribute("data-review-status"), "rejected");
  assert.match((await reviewCard(103).innerText()) ?? "", /Location not provided/);
  assert.match((await reviewCard(101).innerText()) ?? "", /full body/);
  assert.match((await reviewCard(101).innerText()) ?? "", /Antenatal\/postpartum physiotherapy/);
  assert.equal(await reviewCard(101).getByRole("button", { name: "Approve review" }).count(), 1);
  assert.equal(await reviewCard(102).getByRole("button", { name: /Approve|Reject/ }).count(), 0);
  assert.equal(await reviewCard(103).getByRole("button", { name: /Approve|Reject/ }).count(), 0);

  const statusFilter = page.locator('[data-testid="admin-review-status-filter"]');
  await statusFilter.selectOption("approved");
  assert.equal(await reviewCards.count(), 1);
  assert.equal(await reviewCard(102).getAttribute("data-review-status"), "approved");
  await statusFilter.selectOption("pending");
  assert.equal(await reviewCards.count(), 2);
  await statusFilter.selectOption("all");
  assert.equal(await reviewCards.count(), 4);

  // Simulate another tab deciding the review after this page loaded.
  reviews = reviews.map((review) => (review.id === 101 ? { ...review, status: "approved" } : review));
  await page.locator('[data-testid="admin-review-reject-101"]').click();
  await feedback("error").waitFor({ state: "visible" });
  assert.equal(lastReviewMutationStatus, 409, "A stale moderation request should receive a conflict");
  assert.match((await feedback("error").innerText()) ?? "", /already approved/i);
  assert.equal(
    reviews.find((review) => review.id === 101)?.status,
    "approved",
    "A stale rejection must not reverse the server's approved decision",
  );

  await page.reload({ waitUntil: "domcontentloaded" });
  await reviewsTab.waitFor({ state: "visible" });
  await reviewsTab.click();
  await reviewCard(101).waitFor({ state: "visible" });
  assert.equal(await reviewCard(101).getAttribute("data-review-status"), "approved");
  assert.equal(await reviewCard(101).getByRole("button", { name: /Approve|Reject/ }).count(), 0);

  failNextMutation = true;
  await page.locator('[data-testid="admin-review-reject-104"]').click();
  await feedback("error").waitFor({ state: "visible" });
  assert.match((await feedback("error").innerText()) ?? "", /temporarily unavailable/i);
  assert.equal(await reviewCard(104).getAttribute("data-review-status"), "pending");

  await page.locator('[data-testid="admin-review-reject-104"]').click();
  await feedback("success").waitFor({ state: "visible" });
  assert.equal(await reviewCard(104).getAttribute("data-review-status"), "rejected");
  assert.ok(adminFetches >= 3, "moderation success should refresh the displayed review list");

  console.log("Admin review moderation interaction checks passed.");
  await page.close();
} finally {
  await browser?.close();
  server.kill();
}