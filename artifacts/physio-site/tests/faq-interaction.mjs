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

exposeNixBrowserLibraries();

const pages = [
  {
    name: "homepage",
    route: "/",
    testIdPrefix: "home-faq",
  },
  {
    name: "city",
    route: "/physiotherapist-at-home/jaipur",
    testIdPrefix: "city-faq",
  },
  {
    name: "state",
    route: "/physiotherapist-at-home-in/rajasthan",
    testIdPrefix: "state-faq",
  },
];

const browserSmokePages = [
  {
    route: "/",
    name: "homepage",
    heading: /Homecare\s+Physiotherapy\s+Across 45 Cities/,
  },
  {
    route: "/hi",
    name: "Hindi homepage",
    heading: /45 सूचीबद्ध शहरों में घर पर फिजियोथेरेपी/,
  },
  {
    route: "/booking",
    name: "booking",
    heading: /Book a Physiotherapist at Home/,
  },
  {
    route: "/physiotherapist-at-home/jaipur",
    name: "city",
    heading: /Recovery Planning with Home Physiotherapy in\s+Jaipur/,
  },
  {
    route: "/physiotherapist-at-home-in/rajasthan",
    name: "state",
    heading: /Physiotherapist\s+at Home in\s+Rajasthan/,
  },
  {
    route: "/blog",
    name: "journal",
    heading: /Physiotherapy\s*&\s*Rehabilitation\s+—\s+Expert Guides/,
  },
  {
    route: "/reviews",
    name: "reviews",
    heading: /Experiences shared by patients and families/,
  },
];

async function getAvailablePort() {
  const probe = createServer();

  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });

  const address = probe.address();
  assert.ok(
    address && typeof address !== "string",
    "Could not determine a free port",
  );
  const port = address.port;
  await new Promise((resolve, reject) => {
    probe.close((error) => (error ? reject(error) : resolve()));
  });
  return port;
}

async function waitForServer(server, url, output) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(
        `FAQ test server exited before becoming ready.\n${output.join("")}`,
      );
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be binding its port.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`FAQ test server did not become ready.\n${output.join("")}`);
}

async function waitForExpanded(page, testId, expanded) {
  await page.waitForFunction(
    ({ testId: selectorTestId, expected }) =>
      document
        .querySelector(`[data-testid="${selectorTestId}"]`)
        ?.getAttribute("aria-expanded") === expected,
    { testId, expected: String(expanded) },
  );
}

async function mockOptionalApi(page, approvedReviews = []) {
  await page.route("**/api/reviews", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(approvedReviews),
    }),
  );
  await page.route("**/api/bookings/anti-spam-token", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ token: "browser-test-token" }),
    }),
  );
}

async function checkFaqInteraction(pageDefinition, page) {
  const { name, route, testIdPrefix } = pageDefinition;
  await mockOptionalApi(page);
  await page.goto(`http://127.0.0.1:${serverPort}${route}`, {
    waitUntil: "domcontentloaded",
  });
  await page.locator("html[data-hydration-ready='true']").waitFor();
  // The route page is lazy-loaded inside the hydrated shell. Give React a
  // short window to attach its delegated event handlers before clicking the
  // server-rendered FAQ trigger.
  await page.waitForTimeout(300);

  const triggerTestId = `${testIdPrefix}-trigger-0`;
  const contentTestId = `${testIdPrefix}-content-0`;
  const trigger = page.getByTestId(triggerTestId);
  const content = page.getByTestId(contentTestId);

  await trigger.waitFor({ state: "visible" });
  assert.equal(
    await trigger.getAttribute("aria-expanded"),
    "false",
    `${name} FAQ should start collapsed`,
  );
  const answerId = await trigger.getAttribute("aria-controls");
  assert.ok(answerId, `${name} FAQ trigger should identify its answer region`);
  assert.equal(
    await content.getAttribute("id"),
    answerId,
    `${name} FAQ trigger and answer should share a stable relationship`,
  );
  assert.equal(
    await content.getAttribute("role"),
    "region",
    `${name} FAQ answer should expose a region role`,
  );
  assert.equal(
    await content.isHidden(),
    true,
    `${name} FAQ answer should start hidden`,
  );

  await trigger.click();
  await waitForExpanded(page, triggerTestId, true);
  await content.waitFor({ state: "visible" });
  assert.equal(
    await content.isVisible(),
    true,
    `${name} FAQ answer should open after click`,
  );
  assert.match(
    (await content.textContent()) ?? "",
    /\S/,
    `${name} FAQ answer should contain text when open`,
  );

  await trigger.click();
  await waitForExpanded(page, triggerTestId, false);
  await content.waitFor({ state: "hidden" });
  assert.equal(
    await content.isHidden(),
    true,
    `${name} FAQ answer should collapse after second click`,
  );

  await trigger.focus();
  await page.keyboard.press("Enter");
  await waitForExpanded(page, triggerTestId, true);
  assert.equal(
    await trigger.getAttribute("aria-expanded"),
    "true",
    `${name} FAQ should expose aria-expanded after keyboard activation`,
  );
  await content.waitFor({ state: "visible" });
  assert.equal(
    await content.isVisible(),
    true,
    `${name} FAQ should open from the keyboard`,
  );

  await page.keyboard.press("Space");
  await waitForExpanded(page, triggerTestId, false);
  await content.waitFor({ state: "hidden" });
  assert.equal(
    await content.isHidden(),
    true,
    `${name} FAQ should close from the keyboard`,
  );
}

async function checkLanguageToggle(page) {
  await mockOptionalApi(page);
  await page.goto(`http://127.0.0.1:${serverPort}/`, {
    waitUntil: "domcontentloaded",
  });

  const viewportContent = await page.locator('meta[name="viewport"]').getAttribute("content");
  assert.ok(viewportContent, "The homepage should define viewport metadata");
  assert.doesNotMatch(
    viewportContent,
    /maximum-scale\s*=\s*1\b/i,
    "Viewport metadata should allow users to zoom text to 200%",
  );

  const control = page.locator("[data-language-control]").first();
  await control.waitFor({ state: "visible" });

  const brandControl = page.locator('[data-testid="brand-language-control"]');
  await brandControl.waitFor({ state: "visible" });
  const logoBox = await page.locator('[data-testid="link-logo"]').boundingBox();
  const languageBox = await brandControl.boundingBox();
  assert.ok(logoBox && languageBox, "Desktop brand and language controls should be measurable");
  assert.ok(
    languageBox.y > logoBox.y + logoBox.height / 2,
    "Desktop language control should sit beneath the brand banner",
  );

  await Promise.all([
    page.waitForURL((url) => url.pathname === "/hi"),
    control.getByRole("link", { name: "हिंदी" }).click(),
  ]);
  await page.waitForFunction(
    () =>
      document.documentElement.lang === "hi" &&
      document.body.innerText.includes("अपनी रिकवरी की शुरुआत करें"),
  );
  const hindiBody = (await page.locator("body").innerText()) ?? "";
  assert.match(hindiBody, /फिजियोथेरेपी/, "Hindi mode should translate visible page text");
  assert.match(hindiBody, /अपनी रिकवरी की शुरुआत करें/, "Hindi mode should use patient-friendly, curated copy");
  assert.doesNotMatch(
    hindiBody,
    /घर पर फिजियोथेरेपी पूरे India|Expert घर पर|के लिए आप\?/,
    "Hindi mode should not contain the previous word-by-word grammar fragments",
  );

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForFunction(
    () =>
      document.documentElement.lang === "hi" &&
      document.body.innerText.includes("फिजियोथेरेपी"),
  );
  assert.match(
    (await page.locator("body").innerText()) ?? "",
    /फिजियोथेरेपी/,
    "Hindi mode should persist after reload",
  );

  await Promise.all([
    page.waitForURL((url) => url.pathname === "/"),
    page.locator("[data-language-control]").first().getByRole("link", { name: "English" }).click(),
  ]);
  await page.waitForFunction(
    () =>
      document.documentElement.lang === "en" &&
      document.body.innerText.includes("Homecare Physiotherapy"),
  );

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" });
  const mobileBrandControl = page.getByTestId("mobile-brand-language-control");
  await mobileBrandControl.waitFor({ state: "visible" });
  const mobileLogoBox = await page.locator('[data-testid="link-logo"]').boundingBox();
  const mobileLanguageBox = await mobileBrandControl.boundingBox();
  assert.ok(mobileLogoBox && mobileLanguageBox, "Mobile brand and language controls should be measurable");
  assert.ok(
    mobileLanguageBox.y > mobileLogoBox.y + mobileLogoBox.height / 2,
    "Mobile language control should sit beneath the brand banner",
  );
}

async function checkFeedbackFocus(page) {
  await mockOptionalApi(page);
  await page.goto(`http://127.0.0.1:${serverPort}/feedback`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator("html[data-hydration-ready='true']").waitFor();
  await page.locator("form").waitFor({ state: "visible" });
  await page.locator("#feedback-name").fill("Test Patient");
  await page.locator("#feedback-body").fill("A helpful test experience.");
  await page.keyboard.press("Tab");
  const controls = page.locator(
    "form input, form select, form textarea, form button",
  );
  assert.equal(
    await controls.count(),
    10,
    "Feedback form should expose all expected keyboard controls",
  );

  for (let index = 0; index < await controls.count(); index += 1) {
    const control = controls.nth(index);
    await control.focus();
    const focusStyle = await control.evaluate((element) => {
      const style = getComputedStyle(element);
      const parseColor = (value) => {
        const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
        const alpha = value.startsWith("rgba") ? channels[3] ?? 1 : 1;
        return { channels, alpha };
      };
      const luminance = ({ channels }) => {
        const [red, green, blue] = channels.map((channel) => {
          const normalized = channel / 255;
          return normalized <= 0.03928
            ? normalized / 12.92
            : ((normalized + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
      };
      const outline = parseColor(style.outlineColor);
      const elementBackground = parseColor(style.backgroundColor);
      const bodyBackground = parseColor(getComputedStyle(document.body).backgroundColor);
      const background =
        elementBackground.alpha === 0 ? bodyBackground : elementBackground;
      const light = Math.max(luminance(outline), luminance(background));
      const dark = Math.min(luminance(outline), luminance(background));

      return {
        focusVisible: element.matches(":focus-visible"),
        outlineStyle: style.outlineStyle,
        outlineWidth: Number.parseFloat(style.outlineWidth),
        contrast: (light + 0.05) / (dark + 0.05),
      };
    });

    assert.equal(
      focusStyle.focusVisible,
      true,
      `Feedback control ${index + 1} should use keyboard-visible focus`,
    );
    assert.equal(
      focusStyle.outlineStyle,
      "solid",
      `Feedback control ${index + 1} should have a solid focus outline`,
    );
    assert.ok(
      focusStyle.outlineWidth >= 2,
      `Feedback control ${index + 1} should have a 2px focus outline`,
    );
    assert.ok(
      focusStyle.contrast >= 3,
      `Feedback control ${index + 1} focus outline should have at least 3:1 contrast`,
    );
  }
}

async function checkHomepageReviewRatingGroup(page) {
  await mockOptionalApi(page);
  await page.goto(`http://127.0.0.1:${serverPort}/`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator("html[data-hydration-ready='true']").waitFor();
  const form = page.locator("#reviews form");
  await form.waitFor({ state: "visible" });
  const ratingGroup = form.getByRole("group", { name: /Rating/ });

  assert.equal(
    await ratingGroup.count(),
    1,
    "Homepage review rating should expose one labeled group",
  );
  assert.match(
    (await ratingGroup.textContent()) ?? "",
    /Rating/,
    "Homepage review rating group should expose its Rating legend",
  );
  assert.equal(
    await ratingGroup.getByRole("radio").count(),
    5,
    "Homepage review rating group should contain five star options",
  );
  assert.equal(
    await ratingGroup.locator('input[type="radio"]:checked').inputValue(),
    "5",
    "Homepage review rating should select the default five-star option",
  );
  assert.equal(
    await ratingGroup.locator('input[type="radio"]').first().getAttribute("required"),
    "",
    "Homepage review rating should be required",
  );

  const reviewCards = page.locator('[data-testid^="review-card-"]');
  await reviewCards.first().waitFor({ state: "visible" });
  assert.equal(
    await reviewCards.count(),
    6,
    "Homepage should render only its initial review window before the user asks for more",
  );
  const reviewLoadMore = page.getByTestId("review-grid-load-more");
  await reviewLoadMore.waitFor({ state: "visible" });

  while (await reviewLoadMore.count() > 0) {
    await reviewLoadMore.click();
  }
  await page.getByTestId("review-grid-visible-count").filter({ hasText: "Showing 20 of 20" }).waitFor();
  assert.equal(
    await reviewCards.count(),
    20,
    "Homepage should make the complete published review catalogue reachable",
  );
}

async function checkReviewCatalogueInteraction(page) {
  await mockOptionalApi(page, [
    {
      id: 903,
      name: "Noida Patient",
      city: "Noida",
      rating: 4,
      body: "An approved review with a unique locality for filter coverage.",
      createdAt: "2026-09-20T10:00:00.000Z",
    },
  ]);
  await page.goto(`http://127.0.0.1:${serverPort}/reviews`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator("html[data-hydration-ready='true']").waitFor();
  await page
    .getByTestId("review-result-count")
    .filter({ hasText: "21 published experiences match" })
    .waitFor();
  const reviewCards = page.locator('[data-testid^="review-card-"]');
  assert.equal(
    await reviewCards.count(),
    12,
    "The review directory should render its initial review window before the user asks for more",
  );
  await page.getByTestId("review-grid-load-more").click();
  await page.getByTestId("review-grid-visible-count").filter({ hasText: "Showing 21 of 21" }).waitFor();
  assert.equal(
    await reviewCards.count(),
    21,
    "The review directory should expose every published review after incremental loading",
  );

  const hemantCard = page.getByTestId("review-card-homepage-hemant-choudhary");
  assert.equal(
    await hemantCard.count(),
    1,
    "The dedicated review catalogue should contain Hemant only once",
  );
  assert.equal(
    (await hemantCard.locator("p").first().textContent())?.trim(),
    "Tigaon, Haryana",
    "Review location should appear above the review body",
  );

  const preetCard = page.getByTestId("review-card-homepage-preet");
  const readMore = preetCard.getByRole("button", { name: "Read more" });
  await readMore.waitFor({ state: "visible" });
  const bodyId = await readMore.getAttribute("aria-controls");
  assert.ok(bodyId, "Long review control should identify its body region");
  const body = preetCard.locator(`[id="${bodyId}"]`);
  assert.equal(
    await body.getAttribute("role"),
    "region",
    "Long review body should expose a region",
  );
  assert.equal(
    await readMore.getAttribute("aria-expanded"),
    "false",
    "Long reviews should start collapsed",
  );

  await readMore.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Show less" }).waitFor({ state: "visible" });
  assert.equal(
    await body.isVisible(),
    true,
    "Long review should remain visible when expanded",
  );
  assert.match(
    (await body.textContent()) ?? "",
    /complete recovery/,
    "Expanded review should expose the full experience",
  );

  await page.keyboard.press("Space");
  await preetCard.getByRole("button", { name: "Read more" }).waitFor({ state: "visible" });
  assert.equal(
    await preetCard.getByRole("button", { name: "Read more" }).getAttribute("aria-expanded"),
    "false",
    "Long review should collapse from the keyboard",
  );

  const cityFilter = page.getByTestId("review-city-filter");
  await cityFilter.selectOption({ label: "Noida" });
  await page
    .getByTestId("review-result-count")
    .filter({ hasText: "1 published experience matches" })
    .waitFor();
  assert.equal(
    await page.getByTestId("review-card-submitted-903").count(),
    1,
    "An approved API review should be included in city filtering",
  );

  const careNeedFilter = page.getByTestId("review-care-need-filter");
  const staticCareNeed = await careNeedFilter.locator("option").nth(1).getAttribute("value");
  assert.ok(staticCareNeed, "The care-need filter should expose static review conditions");
  await careNeedFilter.selectOption(staticCareNeed);
  await page
    .getByTestId("review-result-count")
    .filter({ hasText: "0 published experiences match" })
    .waitFor();
  await page.getByTestId("review-empty-state").waitFor({ state: "visible" });

  await page.getByTestId("clear-review-filters").click();
  await page
    .getByTestId("review-result-count")
    .filter({ hasText: "21 published experiences match" })
    .waitFor();
  await page.getByTestId("review-grid-visible-count").filter({ hasText: "Showing 12 of 21" }).waitFor();
}

async function selectOptionWithKeyboard(page, select, optionValue) {
  const optionIndex = await select.locator("option").evaluateAll(
    (options, value) =>
      options.findIndex((option) => option.value === value),
    optionValue,
  );
  assert.ok(optionIndex > 0, `Expected select option ${optionValue} to be available`);

  await select.focus();
  assert.equal(
    await select.evaluate((element) => document.activeElement === element),
    true,
    "Filter select should receive keyboard focus",
  );
  await page.keyboard.press("Home");
  for (let index = 0; index < optionIndex; index += 1) {
    await page.keyboard.press("ArrowDown");
  }
  await page.waitForFunction(
    ({ id, expectedValue }) =>
      document.getElementById(id)?.value === expectedValue,
    { id: await select.getAttribute("id"), expectedValue: optionValue },
  );
}

async function checkMobileReviewFilters(page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await mockOptionalApi(page, [
    {
      id: 903,
      name: "Noida Patient",
      city: "Noida",
      rating: 4,
      body: "An approved review with a unique locality for mobile filter coverage.",
      createdAt: "2026-09-20T10:00:00.000Z",
    },
  ]);
  await page.goto(`http://127.0.0.1:${serverPort}/reviews`, {
    waitUntil: "domcontentloaded",
  });

  await page.locator("html[data-hydration-ready='true']").waitFor();
  const cityFilter = page.getByLabel("City", { exact: true });
  const careNeedFilter = page.getByLabel("Care need", { exact: true });
  await cityFilter.waitFor({ state: "visible" });
  await careNeedFilter.waitFor({ state: "visible" });
  assert.equal(await cityFilter.isEnabled(), true, "City filter should be usable on mobile");
  assert.equal(await careNeedFilter.isEnabled(), true, "Care-need filter should be usable on mobile");

  const resultCount = page.getByTestId("review-result-count");
  assert.equal(
    await resultCount.getAttribute("aria-live"),
    "polite",
    "Review result count should be exposed as a polite live region",
  );
  const assertResultAnnouncement = async (expectedText) => {
    await resultCount.filter({ hasText: expectedText }).waitFor();
    const accessibleText = ((await resultCount.textContent()) ?? "").replace(/\s+/g, " ").trim();
    assert.equal(
      accessibleText,
      expectedText,
      "Review result live region should contain one current, non-duplicated announcement",
    );
  };

  await assertResultAnnouncement("21 published experiences match the current filters");

  await selectOptionWithKeyboard(page, cityFilter, "Noida");
  await assertResultAnnouncement("1 published experience matches the current filters");
  const reviewBookingCta = page.getByTestId("reviews-booking-cta");
  assert.equal(
    await reviewBookingCta.getAttribute("href"),
    "/booking",
    "Review booking CTA should use the clean booking route",
  );
  assert.equal(
    await reviewBookingCta.getAttribute("data-booking-city"),
    "noida",
    "Review booking CTA should preserve the selected city as a canonical slug",
  );

  const staticCareNeed = await careNeedFilter.locator("option").nth(1).getAttribute("value");
  assert.ok(staticCareNeed, "The mobile care-need filter should expose a published option");
  await selectOptionWithKeyboard(page, careNeedFilter, staticCareNeed);
  assert.equal(
    await page.getByRole("button", { name: staticCareNeed, exact: true }).getAttribute("aria-pressed"),
    "true",
    "Quick care-need filter should mirror the selected care need",
  );
  await assertResultAnnouncement("0 published experiences match the current filters");

  const emptyState = page.getByTestId("review-empty-state");
  await emptyState.waitFor({ state: "visible" });
  const viewport = page.viewportSize();
  const emptyStateBox = await emptyState.boundingBox();
  assert.ok(viewport && emptyStateBox, "Mobile empty state should be measurable");
  assert.ok(
    emptyStateBox.x >= 0 && emptyStateBox.x + emptyStateBox.width <= viewport.width,
    "Mobile empty state should remain contained within the viewport",
  );
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(
    documentWidth <= viewport.width,
    `Mobile reviews should not overflow horizontally (${documentWidth}px > ${viewport.width}px)`,
  );
}

async function checkMobileCarePathMenu(page) {
  await page.setViewportSize({ width: 390, height: 844 });

  const mobileMenu = page.getByTestId("mobile-menu");
  await mobileMenu.locator(":scope > summary").click();
  const panel = page.getByTestId("mobile-nav-panel");
  const launcher = mobileMenu.getByTestId("care-path-launcher");
  await launcher.getByTestId("care-path-launcher-trigger").click();

  const careMenu = launcher.getByTestId("care-path-launcher-menu");
  await careMenu.waitFor({ state: "visible" });
  assert.equal(
    await careMenu.evaluate((menu) => getComputedStyle(menu).position),
    "static",
    "Mobile care options should expand inside the navigation panel",
  );
  assert.equal(
    await careMenu.getByTestId("care-finder-city").inputValue(),
    "jaipur",
    "Mobile care finder should retain its city context",
  );
  await careMenu.getByTestId("care-finder-choice-online").click();
  assert.equal(
    await careMenu.getByTestId("care-finder-continue").getAttribute("href"),
    "/booking",
    "Mobile online booking should use the clean booking route",
  );
  assert.equal(
    await careMenu.getByTestId("care-finder-continue").getAttribute("data-booking-city"),
    "jaipur",
  );
  assert.equal(
    await careMenu.getByTestId("care-finder-continue").getAttribute("data-booking-mode"),
    "telehealth",
  );

  const careControls = [
    careMenu.getByTestId("care-finder-choice-home"),
    careMenu.getByTestId("care-finder-city"),
    careMenu.getByTestId("care-finder-continue"),
    careMenu.getByTestId("care-finder-cities"),
  ];
  const assertControlFitsPanel = async (control, viewportWidth, viewportHeight) => {
    const panelBox = await panel.boundingBox();
    const controlBox = await control.boundingBox();
    assert.ok(panelBox && controlBox, "Mobile care control and panel should be measurable");
    assert.ok(
      controlBox.x >= panelBox.x - 1 &&
        controlBox.x + controlBox.width <= panelBox.x + panelBox.width + 1,
      "Mobile care controls should fit horizontally inside the navigation panel",
    );
    assert.ok(
      controlBox.y >= panelBox.y - 1 &&
        controlBox.y + controlBox.height <= panelBox.y + panelBox.height + 1,
      "Mobile care controls should fit vertically inside the navigation panel",
    );
    assert.ok(
      controlBox.x >= 0 && controlBox.x + controlBox.width <= viewportWidth,
      "Mobile care controls should remain inside the viewport width",
    );
    assert.ok(
      controlBox.y >= 0 && controlBox.y + controlBox.height <= viewportHeight,
      "Mobile care controls should remain inside the viewport height",
    );
  };

  for (const control of careControls) {
    await control.scrollIntoViewIfNeeded();
    await assertControlFitsPanel(control, 390, 844);
  }

  await page.setViewportSize({ width: 320, height: 568 });
  const scrollState = await panel.evaluate((element) => ({
    overflowY: getComputedStyle(element).overflowY,
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  assert.equal(scrollState.overflowY, "auto", "Short mobile menus should scroll vertically");
  assert.ok(
    scrollState.scrollHeight > scrollState.clientHeight,
    "Expanded short mobile menu should expose its overflow through scrolling",
  );
  for (const control of careControls) {
    await control.scrollIntoViewIfNeeded();
    await assertControlFitsPanel(control, 320, 568);
  }
  const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(
    documentWidth <= 320,
    `Mobile care finder should not cause horizontal page overflow (${documentWidth}px > 320px)`,
  );

  await careControls.at(-1).focus();
  await page.keyboard.press("Escape");
  await careMenu.waitFor({ state: "hidden" });
  assert.equal(
    await mobileMenu.evaluate((details) => details.open),
    true,
    "Escape should close only the care finder, not the mobile navigation",
  );
  await mobileMenu.locator(":scope > summary").click();
}

async function checkBrowserSmoke(pageDefinition, browser) {
  const { route, name, heading: expectedHeading } = pageDefinition;
  const page = await browser.newPage();
  const pageErrors = [];
  const consoleErrors = [];

  page.on("pageerror", (error) => {
    pageErrors.push(error.stack || error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  try {
    await mockOptionalApi(page);
    await page.goto(`http://127.0.0.1:${serverPort}${route}`, {
      waitUntil: "domcontentloaded",
    });
    await page.locator("html[data-hydration-ready='true']").waitFor();

    const primaryHeading = page.getByRole("heading", { level: 1 });
    await primaryHeading.waitFor({ state: "visible" });
    const headingText = ((await primaryHeading.innerText()) ?? "").replace(
      /\s+/g,
      " ",
    );
    assert.match(
      headingText,
      expectedHeading,
      `${name} primary heading should identify the expected page`,
    );

    const carePathLauncher = page.getByTestId("care-path-launcher").first();
    await carePathLauncher.waitFor({ state: "visible" });
    const carePathTrigger = carePathLauncher.getByTestId(
      "care-path-launcher-trigger",
    );
    const carePathTriggerBox = await carePathTrigger.boundingBox();
    assert.ok(
      carePathTriggerBox && carePathTriggerBox.height <= 48,
      `${name} desktop care-finder trigger should stay on one line`,
    );
    await carePathTrigger.click();
    const carePathMenu = carePathLauncher.getByTestId("care-path-launcher-menu");
    await carePathMenu.waitFor({ state: "visible" });
    assert.equal(
      await carePathMenu.getByRole("heading", { name: "Plan your care" }).count(),
      1,
      `${name} care finder should have a named dialog heading`,
    );
    await carePathMenu.getByTestId("care-finder-choice-home").waitFor({ state: "visible" });
    await carePathMenu.getByTestId("care-finder-choice-online").waitFor({ state: "visible" });
    await carePathMenu.getByTestId("care-finder-cities").waitFor({ state: "visible" });
    assert.equal(
      await carePathMenu.evaluate((menu) => getComputedStyle(menu).position),
      "absolute",
      `${name} desktop care finder should remain an anchored popover`,
    );
    const cityMatch = route.match(/^\/physiotherapist-at-home\/([^/]+)/);
    const citySelect = carePathMenu.getByTestId("care-finder-city");
    const continueControl = carePathMenu.getByTestId("care-finder-continue");
    let selectedCity = cityMatch?.[1] ?? "";
    if (cityMatch) {
      assert.equal(
        await citySelect.inputValue(),
        cityMatch[1],
        `${name} care finder should preserve its city context`,
      );
      assert.equal(
        await continueControl.getAttribute("href"),
        "/booking",
        `${name} home-visit request should use the clean booking route`,
      );
      assert.equal(
        await continueControl.getAttribute("data-booking-city"),
        cityMatch[1],
        `${name} home-visit request should preserve the selected city`,
      );
      assert.equal(
        await continueControl.getAttribute("data-booking-mode"),
        "home",
      );
    } else if (route === "/") {
      assert.equal(
        await continueControl.isEnabled(),
        false,
        "Home visits should require a city before continuing",
      );
      await citySelect.selectOption("jaipur");
      selectedCity = "jaipur";
      assert.equal(
        await continueControl.getAttribute("href"),
        "/booking",
        "Choosing a city should keep the request on the clean booking route",
      );
      assert.equal(
        await continueControl.getAttribute("data-booking-city"),
        "jaipur",
        "Choosing a city should preserve its booking context",
      );
      assert.equal(
        await continueControl.getAttribute("data-booking-mode"),
        "home",
      );
    } else {
      assert.equal(
        await continueControl.isEnabled(),
        false,
        `${name} home visits should require a city before continuing`,
      );
    }
    await carePathMenu.getByTestId("care-finder-choice-online").click();
    assert.equal(
      await continueControl.getAttribute("href"),
      "/booking",
      `${name} online booking should use the clean booking route`,
    );
    assert.equal(
      await continueControl.getAttribute("data-booking-city"),
      selectedCity || null,
      `${name} online booking should preserve the selected city`,
    );
    assert.equal(
      await continueControl.getAttribute("data-booking-mode"),
      "telehealth",
      `${name} online booking should preserve the selected care mode`,
    );
    assert.equal(
      await carePathMenu.getByTestId("care-finder-cities").getAttribute("href"),
      "/cities",
      `${name} care finder should preserve city-directory discovery`,
    );
    await page.keyboard.press("Escape");
    await carePathMenu.waitFor({ state: "hidden" });
    assert.equal(
      await carePathLauncher.getByTestId("care-path-launcher-trigger").evaluate(
        (trigger) => document.activeElement === trigger,
      ),
      true,
      `${name} care finder should return focus to its trigger after closing`,
    );
    await carePathLauncher.getByTestId("care-path-launcher-trigger").click();
    await carePathMenu.waitFor({ state: "visible" });
    assert.equal(
      await carePathMenu.getByTestId("care-finder-choice-home").getAttribute("aria-pressed"),
      "true",
      `${name} care finder should reset its care mode when reopened`,
    );
    assert.equal(
      await carePathMenu.getByTestId("care-finder-city").inputValue(),
      cityMatch?.[1] ?? "",
      `${name} care finder should reset temporary city choices when reopened`,
    );
    await page.keyboard.press("Escape");
    await carePathMenu.waitFor({ state: "hidden" });

    if (route === "/physiotherapist-at-home/jaipur") {
      await checkMobileCarePathMenu(page);
    }

    if (route === "/") {
      const carePathChooser = page.getByTestId("care-path-chooser");
      await carePathChooser.waitFor({ state: "visible" });
      await carePathChooser.getByTestId("care-path-choice-online").click();
      assert.equal(
        await carePathChooser.getByTestId("care-path-choice-online").getAttribute("aria-pressed"),
        "true",
        "Homepage care-path choice should expose its selected state",
      );
      assert.equal(
        await carePathChooser.getByTestId("care-path-continue").getAttribute("href"),
        "/booking",
        "Homepage online care path should use the clean booking route",
      );
      assert.equal(
        await carePathChooser.getByTestId("care-path-continue").getAttribute("data-booking-mode"),
        "telehealth",
        "Homepage online care path should preserve telehealth mode",
      );
    }

    if (route === "/booking") {
      await page.getByTestId("booking-care-summary").waitFor({ state: "visible" });
      assert.equal(
        await page.getByTestId("booking-help-phone").count(),
        0,
        "Booking should not render an empty business phone link",
      );
      assert.equal(
        await page.getByTestId("booking-help-whatsapp").count(),
        0,
        "Booking should not render an empty business WhatsApp link",
      );
    }

    if (route === "/hi") {
      await page.waitForFunction(
        () =>
          document.documentElement.lang === "hi" &&
          document.body.innerText.includes("मुखपृष्ठ"),
        { timeout: 10000 },
      );
    }

    // Give hydration and deferred client effects a brief window to surface
    // errors that do not occur during the initial document load.
    await page.waitForTimeout(250);

    assert.deepEqual(
      pageErrors,
      [],
      `${name} should not emit uncaught page errors:\n${pageErrors.join("\n")}`,
    );
    assert.deepEqual(
      consoleErrors,
      [],
      `${name} should not emit browser console errors:\n${consoleErrors.join("\n")}`,
    );
  } finally {
    await page.close();
  }
}

const serverPort = await getAvailablePort();
const serverOutput = [];
const server = spawn(process.execPath, ["serve.mjs"], {
  cwd: siteDirectory,
  env: { ...process.env, PORT: String(serverPort) },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", (chunk) => serverOutput.push(chunk.toString()));
server.stderr.on("data", (chunk) => serverOutput.push(chunk.toString()));

let browser;
try {
  await waitForServer(server, `http://127.0.0.1:${serverPort}/`, serverOutput);
  browser = await chromium.launch({ headless: true });

  for (const pageDefinition of browserSmokePages) {
    await checkBrowserSmoke(pageDefinition, browser);
    console.log(`✓ browser smoke: ${pageDefinition.name} (${pageDefinition.route})`);
  }

  const languagePage = await browser.newPage();
  try {
    await checkLanguageToggle(languagePage);
    console.log("✓ language toggle and persistence");
  } finally {
    await languagePage.close();
  }

  const feedbackPage = await browser.newPage();
  try {
    await checkFeedbackFocus(feedbackPage);
    console.log("✓ feedback keyboard focus visibility");
  } finally {
    await feedbackPage.close();
  }

  const homepageReviewPage = await browser.newPage();
  try {
    await checkHomepageReviewRatingGroup(homepageReviewPage);
    console.log("✓ homepage review rating group labeling");
  } finally {
    await homepageReviewPage.close();
  }

  const reviewCataloguePage = await browser.newPage();
  try {
    await checkReviewCatalogueInteraction(reviewCataloguePage);
    console.log("✓ review catalogue deduplication and collapse interaction");
  } finally {
    await reviewCataloguePage.close();
  }

  const mobileReviewFiltersPage = await browser.newPage();
  try {
    await checkMobileReviewFilters(mobileReviewFiltersPage);
    console.log("✓ mobile review filters and empty state");
  } finally {
    await mobileReviewFiltersPage.close();
  }

  for (const pageDefinition of pages) {
    const page = await browser.newPage();
    try {
      await checkFaqInteraction(pageDefinition, page);
      console.log(`✓ ${pageDefinition.name} FAQ interaction`);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
}
