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
  assert.ok(address && typeof address !== "string");
  const port = address.port;
  await new Promise((resolve, reject) => {
    probe.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

async function waitForServer(server, url, output) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Booking city test server exited early.\n${output.join("")}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be binding its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Booking city test server did not become ready.\n${output.join("")}`);
}

async function waitForSelectedCity(page, cityName) {
  await page.waitForFunction(
    ({ expectedCity }) =>
      document.querySelector('[data-testid="select-city"]')
        ?.selectedOptions?.[0]?.textContent?.includes(expectedCity),
    { expectedCity: cityName },
  );
}

function getFutureDateValue() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().slice(0, 10);
}

async function run() {
  exposeNixBrowserLibraries();
  const serverPort = await getAvailablePort();
  const output = [];
  const server = spawn("node", ["serve.mjs"], {
    cwd: siteDirectory,
    env: { ...process.env, PORT: String(serverPort), BASE_PATH: "/" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => output.push(chunk.toString()));
  server.stderr.on("data", (chunk) => output.push(chunk.toString()));
  let browser;

  try {
    await waitForServer(server, `http://127.0.0.1:${serverPort}/`, output);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    let submittedBooking;
    const browserErrors = [];
    page.on("pageerror", (error) => browserErrors.push(error.message));

    await page.route("**/api/bookings/anti-spam-token", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ token: "browser-test-token" }),
      }),
    );
    await page.route("**/api/bookings", async (route) => {
      if (route.request().method() !== "POST") {
        await route.continue();
        return;
      }

      submittedBooking = JSON.parse(route.request().postData() ?? "{}");
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ id: 987 }),
      });
    });

    await page.goto(`http://127.0.0.1:${serverPort}/`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("html[data-hydration-ready='true']").waitFor();
    const startJourney = page.getByRole("link", {
      name: "Start Your Journey",
      exact: true,
    });
    assert.equal(
      await startJourney.getAttribute("href"),
      "/booking",
      "Start Your Journey should keep the booking URL query-free",
    );
    await startJourney.click();
    await page.waitForFunction(
      () => location.pathname === "/booking" && location.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.equal(
      await page.getByTestId("tab-online").getAttribute("aria-pressed"),
      "true",
      "Start Your Journey should select online consultation",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("html[data-hydration-ready='true']").waitFor();
    const pricedTelehealthLink = page.getByRole("link", {
      name: /^Book now/,
    });
    assert.equal(
      await pricedTelehealthLink.getAttribute("href"),
      "/booking",
      "the priced telehealth CTA should keep the booking URL query-free",
    );
    await pricedTelehealthLink.click();
    await page.waitForFunction(
      () => location.pathname === "/booking" && location.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.equal(
      await page.getByTestId("tab-online").getAttribute("aria-pressed"),
      "true",
      "the priced telehealth CTA should select online consultation without a query URL",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("html[data-hydration-ready='true']").waitFor();
    await page.getByTestId("button-hero-booking").click();
    await page.waitForFunction(
      () => location.pathname === "/booking" && location.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.equal(
      await page.getByTestId("tab-home-visit").getAttribute("aria-pressed"),
      "true",
      "The one-use online mode should not carry over to an ordinary booking link",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("html[data-hydration-ready='true']").waitFor();
    const bookNow = page.getByRole("link", { name: /Book now/ });
    assert.equal(
      await bookNow.getAttribute("href"),
      "/booking",
      "Book now should keep the booking URL query-free",
    );
    await bookNow.click();
    await page.waitForFunction(
      () => location.pathname === "/booking" && location.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.equal(
      await page.getByTestId("tab-online").getAttribute("aria-pressed"),
      "true",
      "Book now should select online consultation",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("html[data-hydration-ready='true']").waitFor();
    const bookOnlineConsultation = page.getByRole("link", {
      name: "Book online consultation",
      exact: true,
    });
    assert.equal(
      await bookOnlineConsultation.getAttribute("href"),
      "/booking",
      "Book online consultation should keep the booking URL query-free",
    );
    await bookOnlineConsultation.click();
    await page.waitForFunction(
      () => location.pathname === "/booking" && location.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.equal(
      await page.getByTestId("tab-online").getAttribute("aria-pressed"),
      "true",
      "Book online consultation should select online consultation",
    );

    await page.goto(
      `http://127.0.0.1:${serverPort}/physiotherapist-at-home/jaipur`,
      { waitUntil: "domcontentloaded" },
    );
    await page.locator("html[data-hydration-ready='true']").waitFor();
    const cityPageBooking = page.getByRole("link", {
      name: "Check Home-Visit Availability",
      exact: true,
    });
    assert.equal(
      await cityPageBooking.getAttribute("href"),
      "/booking",
      "City page booking CTA should use the clean booking route",
    );
    assert.equal(
      await cityPageBooking.getAttribute("data-booking-city"),
      "jaipur",
      "City page booking CTA should preserve the city slug as booking context",
    );
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /Online consultation[\s\S]*₹742/,
      "City pages should promote the current online consultation price",
    );
    const cityOnlineBooking = page.getByRole("link", { name: "Book online consultation" });
    assert.equal(
      await cityOnlineBooking.getAttribute("href"),
      "/booking",
      "City teleconsultation CTA should use the clean booking route",
    );
    assert.equal(await cityOnlineBooking.getAttribute("data-booking-city"), "jaipur");
    assert.equal(await cityOnlineBooking.getAttribute("data-booking-mode"), "telehealth");

    const localityCard = page.locator("#murlipura");
    const localityBooking = localityCard.getByRole("link", {
      name: "Check home-visit availability",
    });
    assert.equal(
      await localityBooking.getAttribute("href"),
      "/booking",
      "Locality booking CTA should use the clean booking route",
    );
    assert.equal(await localityBooking.getAttribute("data-booking-city"), "jaipur");
    assert.equal(await localityBooking.getAttribute("data-booking-locality"), "murlipura");
    assert.equal(await localityBooking.getAttribute("data-booking-mode"), "home");
    assert.equal(
      await localityCard.getByRole("link", { name: "WhatsApp quick help" }).count(),
      0,
      "Locality WhatsApp CTA should be omitted when no business number is configured",
    );
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /Home visits confirmed within 12 hours/,
      "Active city pages should promise 12-hour confirmation",
    );
    assert.equal(
      await page.locator('[data-cta="city-phone"]').count(),
      0,
      "City pages should not render an empty business phone link",
    );
    assert.equal(
      await page.locator('[data-cta="city-whatsapp"], [data-cta="global-whatsapp"]').count(),
      0,
      "City pages should not render WhatsApp CTAs without a configured business number",
    );
    assert.equal(
      await page.locator('a[href^="?text="]').count(),
      0,
      "No contact link should degrade into a relative query URL",
    );
    assert.equal(
      await page.getByTestId("progressive-care-journey").count(),
      1,
      "Active city pages should expose one progressive care journey",
    );
    assert.match(
      (await page.getByTestId("progressive-care-journey").textContent()) ?? "",
      /clinician availability before confirming a home visit/,
      "Active city journey should explain locality and clinician review",
    );

    await localityBooking.click();
    await page.waitForURL(
      (url) => url.pathname === "/booking" && url.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    await page.getByTestId("select-city").waitFor({ state: "visible" });
    await waitForSelectedCity(page, "Jaipur");
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /Home visit area: Murlipura, Jaipur/,
      "Booking form should show the locality context from a locality CTA",
    );

    await page.goto(
      `http://127.0.0.1:${serverPort}/physiotherapist-at-home/jaipur`,
      { waitUntil: "domcontentloaded" },
    );
    await page.locator("html[data-hydration-ready='true']").waitFor();
    await cityPageBooking.click();
    await page.waitForURL(
      (url) => url.pathname === "/booking" && url.search === "",
    );
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    await page.getByTestId("select-city").waitFor({ state: "visible" });
    await waitForSelectedCity(page, "Jaipur");
    assert.match(
      (await page.getByTestId("select-city").locator("option:checked").textContent()) ?? "",
      /Jaipur/,
      "Booking form should preselect the city from a city page",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/booking?city=gurgaon`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    await page.getByTestId("select-city").waitFor({ state: "visible" });
    await waitForSelectedCity(page, "Gurugram (Gurgaon)");
    assert.match(
      (await page.getByTestId("select-city").locator("option:checked").textContent()) ?? "",
      /Gurugram \(Gurgaon\)/,
      "Booking city option should use the current name and familiar alias",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/cities`, {
      waitUntil: "domcontentloaded",
    });
    assert.equal(
      await page.getByRole("link", { name: "Book an Appointment in Bengaluru" }).count(),
      0,
      "Cities hub should not repeat a booking CTA for every city",
    );
    assert.equal(
      await page.getByRole("link", { name: "Send a home-visit request" }).getAttribute("href"),
      "/booking",
      "Cities hub should retain its global home-visit CTA",
    );
    assert.equal(
      await page.getByRole("link", { name: "Start online consultation" }).getAttribute("href"),
      "/booking",
      "Cities hub should keep its telehealth CTA on the clean booking route",
    );
    assert.equal(
      await page.getByRole("link", { name: "Start online consultation" }).getAttribute("data-booking-mode"),
      "telehealth",
      "Cities hub should preserve its online-consultation mode",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/booking?city=jaipur&mode=telehealth`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByTestId("tab-online").waitFor({ state: "visible" });
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.deepEqual(
      browserErrors,
      [],
      "Direct telehealth booking loads should hydrate without browser errors",
    );
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /₹742 \/ \$7\.91 per consultation/,
      "Telehealth booking links should open with the current price",
    );
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /same day, usually within 6 hours and no later than 12 hours/,
      "Online consultation bookings should promise same-day confirmation within 6–12 hours",
    );
    assert.match(
      (await page.getByTestId("progressive-care-journey").textContent()) ?? "",
      /video assessment slot/,
      "Online booking journey should explain video assessment confirmation",
    );
    assert.match(
      (await page.getByTestId("progressive-care-journey").textContent()) ?? "",
      /Sending a request does not charge you/,
      "Booking journey should keep payment optional before request submission",
    );
    await page.getByTestId("checkbox-price-acceptance").check();
    await page.getByTestId("tab-home-visit").click();
    assert.equal(
      await page.getByTestId("checkbox-price-acceptance").isChecked(),
      false,
      "Switching from online to home visits must clear price acceptance",
    );
    await page.getByTestId("checkbox-price-acceptance").check();
    await page.getByTestId("tab-online").click();
    assert.equal(
      await page.getByTestId("checkbox-price-acceptance").isChecked(),
      false,
      "Switching from home visits to online must clear price acceptance",
    );

    await page.goto(`http://127.0.0.1:${serverPort}/booking?city=unknown-city`, {
      waitUntil: "domcontentloaded",
    });
    await page.getByTestId("select-city").waitFor({ state: "visible" });
    assert.deepEqual(
      browserErrors,
      [],
      "Direct unknown-city booking loads should hydrate without browser errors",
    );
    assert.match(
      (await page.getByTestId("select-city").locator("option:checked").textContent()) ?? "",
      /Select your city/,
      "Unknown city query parameters should leave the selector empty",
    );

    await page.goto(
      `http://127.0.0.1:${serverPort}/physiotherapist-at-home/hyderabad`,
      { waitUntil: "domcontentloaded" },
    );
    const formerlyExpansionBody = (await page.locator("body").textContent()) ?? "";
    assert.match(
      formerlyExpansionBody,
      /Home visits are active at city level in Hyderabad/,
      "Former expansion cities should now show active city-level home visits",
    );
    assert.match(
      formerlyExpansionBody,
      /exact locality and clinician availability are confirmed before booking/,
      "Former expansion cities should retain exact locality and clinician confirmation",
    );
    assert.doesNotMatch(
      formerlyExpansionBody,
      /Home visits depend on team placement/,
      "Former expansion cities should not retain expansion-only placement copy",
    );
    assert.equal(
      await page.locator(
        '[data-cta="city-whatsapp"], [data-cta="locality-whatsapp"], [data-cta="global-whatsapp"]',
      ).count(),
      0,
      "Active city pages should omit WhatsApp CTAs when no business number is configured",
    );
    assert.equal(
      await page.locator('a[href^="?text="]').count(),
      0,
      "Active city pages should not create a relative WhatsApp URL",
    );
    assert.equal(
      await page.getByTestId("progressive-care-journey").count(),
      1,
      "Expansion city pages should expose one progressive care journey",
    );
    assert.match(
      (await page.getByTestId("progressive-care-journey").textContent()) ?? "",
      /clinician availability before confirming a home visit/,
      "Active city journey should explain clinician confirmation",
    );
    assert.equal(
      await page.getByRole("link", { name: "Send a home-visit enquiry" }).count(),
      0,
      "Active city pages should not show the expansion-only enquiry CTA",
    );
    const cityBookingCta = page.locator('[data-cta="city-booking"]').first();
    assert.equal(
      await cityBookingCta.getAttribute("href"),
      "/booking",
      "Active city pages should use the clean booking route",
    );
    assert.equal(
      await cityBookingCta.getAttribute("data-booking-city"),
      "hyderabad",
      "Active city CTAs should preserve their city as booking context",
    );
    assert.equal(
      await cityBookingCta.getAttribute("data-booking-mode"),
      "home",
      "Active city CTAs should preserve the home-visit mode as booking context",
    );

    await page.goto(
      `http://127.0.0.1:${serverPort}/booking?city=hyderabad&mode=telehealth`,
      { waitUntil: "domcontentloaded" },
    );
    await page.getByTestId("select-video-platform").waitFor({ state: "visible" });
    await page.locator('form[data-client-ready="true"]').waitFor({ state: "visible" });
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /same day, usually within 6 hours and no later than 12 hours/,
      "Online consultation bookings should carry same-day 6–12-hour confirmation messaging",
    );
    await page.getByTestId("input-firstname").fill("Browser");
    await page.getByTestId("input-lastname").fill("Regression");
    await page.getByTestId("input-email").fill("browser-test@example.com");
    await page.getByTestId("input-phone").fill("+919876543210");
    await page.getByTestId("select-type").selectOption({ index: 1 });
    await page.getByTestId("input-preferred-date").fill(getFutureDateValue());
    await page.getByTestId("textarea-main-concern").fill(
      "Online consultation regression test concern",
    );
    await page.getByTestId("select-affected-area").selectOption({ index: 1 });
    await page.getByTestId("select-video-platform").selectOption("Zoom");
    await page.getByTestId("button-submit-booking").click();
    assert.equal(
      submittedBooking,
      undefined,
      "Booking form must reject submission until displayed price is acknowledged",
    );
    assert.match(
      (await page.locator("body").textContent()) ?? "",
      /acknowledge the displayed online consultation price/i,
      "Booking form should explain the missing price acknowledgement",
    );
    await page.getByTestId("checkbox-price-acceptance").check();
    await page.waitForFunction(() => {
      const button = document.querySelector('[data-testid="button-submit-booking"]');
      return button instanceof HTMLButtonElement && !button.disabled;
    });
    await page.getByTestId("button-submit-booking").click();
    await page.getByRole("heading", { name: "Booking Request Received" }).waitFor({
      state: "visible",
    });
    assert.equal(
      submittedBooking?.city,
      "hyderabad",
      "Expansion booking submission should preserve the city slug",
    );
    assert.match(
      submittedBooking?.notes ?? "",
      /Preferred video platform: Zoom/,
      "Booking submission should include the selected video platform",
    );
    assert.equal(
      submittedBooking?.acceptedPriceMode,
      "telehealth",
      "Booking submission should bind acceptance to online mode",
    );
    assert.equal(
      submittedBooking?.acceptedPriceKey,
      "telehealth_v1",
      "Booking submission should use the server-known online price key",
    );
    assert.equal(
      submittedBooking?.priceAccepted,
      true,
      "Booking submission should include explicit price acceptance",
    );

  } finally {
    await browser?.close();
    server.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});