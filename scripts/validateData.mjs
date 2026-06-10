import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, "..", "data", "research.json");

const errors = [];

const assert = (condition, message) => {
  if (!condition) errors.push(message);
};

const isString = (value) => typeof value === "string" && value.trim().length > 0;

const EVIDENCE_LEVELS = new Set(["exploratory", "clinical", "synthesis"]);
const ACTIONABILITY_VALUES = new Set([
  "learn",
  "discuss_with_clinician",
  "emerging_only",
]);

async function validate() {
  const raw = await fs.readFile(DATA_PATH, "utf8");

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch (error) {
    throw new Error(`research.json is not valid JSON: ${error.message}`);
  }

  assert(
    typeof payload === "object" && payload !== null,
    "Payload must be an object.",
  );
  assert(
    Array.isArray(payload.categories),
    "Payload must include a categories array.",
  );

  if (!Array.isArray(payload.categories)) {
    return;
  }

  const ids = new Set();
  const articleIds = new Set();
  payload.categories.forEach((category, index) => {
    assert(
      typeof category === "object" && category !== null,
      `Category ${index} must be an object.`,
    );
    assert(isString(category.id), `Category ${index} must include an id.`);
    assert(
      isString(category.title),
      `Category ${category.id ?? index} needs a title.`,
    );
    assert(
      Array.isArray(category.articles),
      `Category ${category.id} must have an articles array.`,
    );
    if (category.id) {
      assert(
        !ids.has(category.id),
        `Category id "${category.id}" is duplicated.`,
      );
      ids.add(category.id);
    }

    (category.articles ?? []).forEach((article, articleIndex) => {
      assert(
        typeof article === "object" && article !== null,
        `Article ${category.id}#${articleIndex} must be an object.`,
      );
      assert(
        isString(article.id),
        `Article ${category.id}#${articleIndex} missing id.`,
      );
      assert(
        isString(article.title),
        `Article ${article.id} missing title.`,
      );
      assert(
        isString(article.url),
        `Article ${article.id} missing url.`,
      );
      if (isString(article.id)) {
        assert(
          !articleIds.has(article.id),
          `Article id "${article.id}" appears in more than one category.`,
        );
        articleIds.add(article.id);
      }
      if (article.evidenceLevel !== undefined) {
        assert(
          EVIDENCE_LEVELS.has(article.evidenceLevel),
          `Article ${article.id} has invalid evidenceLevel "${article.evidenceLevel}".`,
        );
      }
      if (article.actionability !== undefined) {
        assert(
          ACTIONABILITY_VALUES.has(article.actionability),
          `Article ${article.id} has invalid actionability "${article.actionability}".`,
        );
      }
    });
  });

  if (errors.length) {
    const intro = `research.json failed validation (${errors.length} issues):`;
    throw new Error(`${intro}\n- ${errors.join("\n- ")}`);
  }
}

validate()
  .then(() => {
    console.log(`Validated ${path.relative(process.cwd(), DATA_PATH)} ✅`);
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
