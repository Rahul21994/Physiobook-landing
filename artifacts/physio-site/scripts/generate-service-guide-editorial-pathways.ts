import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { serviceGuides } from "../src/lib/service-guides";
import { createServiceGuideEditorialPathways } from "../src/lib/service-guide-editorial-pathways";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = path.join(root, "src/lib/service-guide-editorial-pathways.generated.json");
const pathways = createServiceGuideEditorialPathways(serviceGuides);

for (const [slug, links] of Object.entries(pathways)) {
  if (
    links.length !== 3 ||
    new Set(links.map(([articleSlug]) => articleSlug)).size !== 3 ||
    links.some(([articleSlug, label]) =>
      !articleSlug || articleSlug.includes("/") || !label.trim()
    )
  ) {
    throw new Error(`Expected three unique, excerpted blog links for service guide "${slug}".`);
  }
}

await writeFile(outputPath, `${JSON.stringify(pathways, null, 2)}\n`, "utf8");
console.log(`Generated three contextual Journal links for ${Object.keys(pathways).length} service guides.`);