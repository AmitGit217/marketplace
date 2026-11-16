import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backend = path.join(root, "backend");
const clientDist = path.join(root, "client", "dist");
const output = path.join(root, ".vercel", "output");
const funcDir = path.join(output, "functions", "server.func");
const funcBackend = path.join(funcDir, "backend");

const hostEntry = ["dist/host.js", "dist/src/host.js"].find((candidate) =>
  existsSync(path.join(backend, candidate)),
);

if (!existsSync(path.join(clientDist, "index.html"))) {
  console.error("Client build output was not found at client/dist.");
  process.exit(1);
}

if (!hostEntry) {
  console.error("Compiled host entry was not found. Build the backend first.");
  process.exit(1);
}

rmSync(output, { recursive: true, force: true });
mkdirSync(funcBackend, { recursive: true });

cpSync(clientDist, path.join(output, "static"), { recursive: true });
cpSync(path.join(clientDist, "index.html"), path.join(funcDir, "index.html"));
const backendPackage = JSON.parse(
  readFileSync(path.join(backend, "package.json"), "utf8"),
);
const runtimeDependencies = [
  "@nestjs/common",
  "@nestjs/core",
  "@nestjs/jwt",
  "@nestjs/mapped-types",
  "@nestjs/platform-express",
  "@prisma/adapter-pg",
  "@prisma/client",
  "bcrypt",
  "class-transformer",
  "class-validator",
  "dotenv",
  "pg",
  "reflect-metadata",
  "rxjs",
  "tsx",
];

writeFileSync(
  path.join(funcBackend, "package.json"),
  JSON.stringify(
    {
      name: "marketplace-server",
      private: true,
      dependencies: Object.fromEntries(
        runtimeDependencies.map((name) => [
          name,
          backendPackage.dependencies[name],
        ]),
      ),
    },
    null,
    2,
  ),
);
cpSync(path.join(backend, "prisma.config.ts"), path.join(funcBackend, "prisma.config.ts"));
cpSync(path.join(backend, "prisma"), path.join(funcBackend, "prisma"), {
  recursive: true,
});

const install = spawnSync("npm", ["install", "--omit=dev"], {
  cwd: funcBackend,
  stdio: "inherit",
  env: process.env,
});

if (install.status !== 0) {
  console.error("Failed to install the hosted server dependencies.");
  process.exit(install.status ?? 1);
}

cpSync(path.join(backend, "dist"), path.join(funcBackend, "dist"), {
  recursive: true,
});
cpSync(path.join(backend, "generated"), path.join(funcBackend, "generated"), {
  recursive: true,
});

writeFileSync(
  path.join(funcDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs22.x",
      handler: "index.js",
      launcherType: "Nodejs",
      shouldAddHelpers: false,
      maxDuration: 60,
    },
    null,
    2,
  ),
);

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
if (databaseUrl) {
  const setup = spawnSync(process.execPath, ["scripts/start.mjs"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, SETUP_ONLY: "1" },
  });
  if (setup.status !== 0) {
    console.error("Database setup failed.");
    process.exit(setup.status ?? 1);
  }
}

writeFileSync(
  path.join(funcDir, "index.js"),
  `const path = require("path");

process.env.SPA_INDEX = path.join(__dirname, "index.html");
require("./backend/node_modules/tsx/dist/cjs/index.cjs");

const { handler } = require("./backend/${hostEntry}");

function restorePath(req) {
  const host = req.headers.host || "localhost";
  let current;

  try {
    current = new URL(req.url || "/", "http://" + host);
  } catch {
    return;
  }

  if (!current.searchParams.has("__path")) {
    return;
  }

  const pathname = current.searchParams.get("__path") || "";
  current.searchParams.delete("__path");
  const query = current.searchParams.toString();
  req.url = "/" + pathname + (query ? "?" + query : "");
}

module.exports = function (req, res) {
  restorePath(req);
  return handler(req, res);
};
`,
);

writeFileSync(
  path.join(output, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { handle: "filesystem" },
        { src: "^/(.*)$", dest: "/server?__path=$1" },
      ],
    },
    null,
    2,
  ),
);

console.log("Host output written to .vercel/output");
