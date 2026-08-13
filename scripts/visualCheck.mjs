/**
 * Visual validation harness. Renders key routes at desktop and mobile
 * viewports, fails on horizontal overflow (the classic "text breaks on
 * mobile" bug), verifies the nav is usable at each size, and saves
 * screenshots to screenshots/ for human review.
 *
 * Usage: node scripts/visualCheck.mjs [baseUrl]
 *        (defaults to http://localhost:5173)
 */
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "screenshots");
const BASE_URL = process.argv[2] ?? "http://localhost:5173";

const ROUTES = [
  { id: "landing", path: "/" },
  { id: "category-treatment", path: "/category/treatment" },
  { id: "guide-warning-signs", path: "/guide/early-warning-signs" },
  { id: "prevalence", path: "/prevalence" },
  { id: "donate", path: "/donate" },
  { id: "privacy", path: "/privacy" },
  { id: "terms", path: "/terms" },
];

const VIEWPORTS = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "mobile", width: 375, height: 812 },
];

const THEMES = ["light", "dark"];

const failures = [];

async function findOverflowingElements(page) {
  return page.evaluate(() => {
    const viewportWidth = document.documentElement.clientWidth;
    const offenders = [];
    for (const el of document.querySelectorAll("body *")) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.right > viewportWidth + 1) {
        offenders.push({
          tag: el.tagName.toLowerCase(),
          class: typeof el.className === "string" ? el.className.slice(0, 90) : "",
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        });
      }
    }
    return {
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth,
      offenders: offenders.slice(0, 8),
    };
  });
}

async function checkNav(page, viewport) {
  if (viewport.id === "desktop") {
    const visible = await page
      .getByRole("navigation", { name: "Primary" })
      .isVisible()
      .catch(() => false);
    return visible ? null : "Primary nav links not visible on desktop.";
  }
  // Mobile: the menu button must exist, open a menu with the primary
  // links, and close again.
  const menuButton = page.getByRole("button", { name: /open menu|close menu/i });
  if (!(await menuButton.isVisible().catch(() => false))) {
    return "Mobile menu button is missing.";
  }
  await menuButton.click();
  const firstLink = page
    .getByRole("navigation", { name: "Mobile" })
    .getByRole("link", { name: "Browse" });
  if (!(await firstLink.isVisible().catch(() => false))) {
    return "Mobile menu did not reveal the nav links.";
  }
  await menuButton.click();
  return null;
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch();

  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        colorScheme: theme,
      });
      await context.addInitScript(
        ({ selectedTheme }) => {
          localStorage.setItem("schizopedia-theme", selectedTheme);
        },
        { selectedTheme: theme },
      );

      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route.path}`;
        await page.goto(url, { waitUntil: "networkidle" });

        const overflow = await findOverflowingElements(page);
        if (overflow.scrollWidth > overflow.viewportWidth + 1) {
          failures.push(
            `[${theme}/${viewport.id}] ${route.path} overflows horizontally ` +
              `(${overflow.scrollWidth}px content in ${overflow.viewportWidth}px viewport). ` +
              `Widest offenders: ${overflow.offenders
                .map(
                  (offender) =>
                    `<${offender.tag} class="${offender.class}"> right=${offender.right}`,
                )
                .join(" | ")}`,
          );
        }

        if (route.id === "landing") {
          const navProblem = await checkNav(page, viewport);
          if (navProblem) {
            failures.push(`[${theme}/${viewport.id}] ${navProblem}`);
          }
        }

        await page.screenshot({
          path: path.join(
            OUT_DIR,
            `${route.id}-${theme}-${viewport.id}.png`,
          ),
          fullPage: true,
        });
      }

      await context.close();
    }
  }

  await browser.close();

  if (failures.length) {
    console.error(`✗ Visual check failed (${failures.length} issues):`);
    for (const failure of failures) console.error(`  - ${failure}`);
    console.error(`Screenshots saved to ${path.relative(ROOT, OUT_DIR)}/`);
    process.exitCode = 1;
    return;
  }
  console.log(
    `Visual check passed: ${ROUTES.length} routes × ${VIEWPORTS.length} viewports × ${THEMES.length} themes, no overflow, nav OK ✅`,
  );
  console.log(`Screenshots saved to ${path.relative(ROOT, OUT_DIR)}/`);
}

main().catch((error) => {
  console.error("Visual check crashed:", error);
  process.exitCode = 1;
});
