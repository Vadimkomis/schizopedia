import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const distDir = path.join(projectRoot, "dist");
const clientDir = path.join(distDir, "client");
const serverDir = path.join(distDir, "server");

await mkdir(clientDir, { recursive: true });

const entries = await readdir(distDir, { withFileTypes: true });
await Promise.all(
  entries
    .filter(({ name }) => name !== "client" && name !== "server")
    .map(({ name }) =>
      cp(path.join(distDir, name), path.join(clientDir, name), {
        recursive: true,
      }),
    ),
);

await mkdir(serverDir, { recursive: true });
await writeFile(
  path.join(serverDir, "index.js"),
  `const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404) return response;

    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = "/index.html";
    return env.ASSETS.fetch(new Request(fallbackUrl, request));
  },
};

export default worker;
`,
  "utf8",
);

console.log("Prepared Cloudflare Sites worker and static asset bundle ✅");
