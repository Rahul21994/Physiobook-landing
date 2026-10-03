import assert from "node:assert/strict";
import test from "node:test";
import { fingerprintHindiRouteCopy } from "../scripts/hindi-copy-fingerprint.mjs";

const approvedMarkup = `<!doctype html>
<html lang="hi">
  <head>
    <title>स्वीकृत पृष्ठ शीर्षक</title>
    <meta name="description" content="स्वीकृत पृष्ठ विवरण">
  </head>
  <body>
    <nav>Global navigation label</nav>
    <main>
      <h1 id="approved-heading">स्वीकृत मुख्य कॉपी</h1>
      <main><p>Nested main copy</p></main>
      <p>कॉपी के बाद का मुख्य विवरण</p>
      <a href="/hi/booking?city=jaipur">बुकिंग लिंक</a>
      <select id="city" name="city">
        <option value="jaipur">Jaipur</option>
      </select>
      <input id="city-id" name="cityId" value="101">
    </main>
    <footer>Global footer label</footer>
  </body>
</html>`;

test("fingerprint ignores shell, route identifiers, URLs, and booking control values", () => {
  const changedNonCopy = approvedMarkup
    .replace("Global navigation label", "Changed navigation")
    .replace("Global footer label", "Changed footer")
    .replace('id="approved-heading"', 'id="new-heading"')
    .replace('href="/hi/booking?city=jaipur"', 'href="/booking?city=delhi"')
    .replace('<option value="jaipur">Jaipur</option>', '<option value="delhi">Delhi</option>')
    .replace('id="city-id" name="cityId" value="101"', 'id="other-id" name="otherId" value="999"');

  assert.equal(
    fingerprintHindiRouteCopy(changedNonCopy),
    fingerprintHindiRouteCopy(approvedMarkup),
  );
});

test("fingerprint detects visible copy edits, including content after nested main tags", () => {
  const changedCopy = approvedMarkup.replace(
    "कॉपी के बाद का मुख्य विवरण",
    "कॉपी के बाद बदला हुआ मुख्य विवरण",
  );
  assert.notEqual(fingerprintHindiRouteCopy(changedCopy), fingerprintHindiRouteCopy(approvedMarkup));
});

test("fingerprint detects title and meta description edits", () => {
  const changedTitle = approvedMarkup.replace("स्वीकृत पृष्ठ शीर्षक", "नया पृष्ठ शीर्षक");
  const changedDescription = approvedMarkup.replace("स्वीकृत पृष्ठ विवरण", "नया पृष्ठ विवरण");
  assert.notEqual(fingerprintHindiRouteCopy(changedTitle), fingerprintHindiRouteCopy(approvedMarkup));
  assert.notEqual(
    fingerprintHindiRouteCopy(changedDescription),
    fingerprintHindiRouteCopy(approvedMarkup),
  );
});