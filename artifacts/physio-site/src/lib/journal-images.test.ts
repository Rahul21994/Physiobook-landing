import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { blogPosts } from "./data.js";
import {
  getJournalCardImagePath,
  getJournalImageFilename,
  getJournalImagePath,
  getJournalWebpImagePath,
} from "./journal-images.js";

const imageDirectory = fileURLToPath(new URL("../../public/images/journal/", import.meta.url));

test("every Journal article resolves to its own topic image in all existing formats", () => {
  const assignments = blogPosts.map((post) => ({
    slug: post.slug,
    filename: getJournalImageFilename(post.slug, post.image),
  }));
  const ownersByImage = new Map<string, string>();
  const ownersByImageContent = new Map<string, string>();

  for (const { slug, filename } of assignments) {
    const previousOwner = ownersByImage.get(filename);
    assert.equal(
      previousOwner,
      undefined,
      `${slug} shares ${filename} with ${previousOwner}`,
    );
    ownersByImage.set(filename, slug);

    const imageContentHash = createHash("sha256")
      .update(readFileSync(`${imageDirectory}/${filename}`))
      .digest("hex");
    const previousContentOwner = ownersByImageContent.get(imageContentHash);
    assert.equal(
      previousContentOwner,
      undefined,
      `${slug} uses the same image content as ${previousContentOwner}`,
    );
    ownersByImageContent.set(imageContentHash, slug);

    for (const assetPath of [
      getJournalImagePath(slug, filename),
      getJournalWebpImagePath(slug, filename),
      getJournalCardImagePath(slug, filename),
    ]) {
      const assetName = assetPath.split("/").at(-1);
      assert.ok(assetName, `Missing asset filename for ${slug}`);
      assert.ok(
        existsSync(`${imageDirectory}/${assetName}`),
        `${slug} is missing Journal image asset ${assetName}`,
      );
    }
  }

  assert.ok(assignments.length > 0, "Expected at least one Journal article");
});