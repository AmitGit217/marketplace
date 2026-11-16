import { spawnSync } from "child_process";
import { existsSync } from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import { join } from "path";
import { createApp } from "./main";

type ExpressApp = (req: IncomingMessage, res: ServerResponse) => void;

function findBackendRoot(): string {
  const candidates = [join(__dirname, ".."), join(__dirname, "..", "..")];

  for (const candidate of candidates) {
    if (existsSync(join(candidate, "prisma", "schema.prisma"))) {
      return candidate;
    }
  }

  throw new Error("Prisma schema was not found next to the server build.");
}

function resolveRuntimeFile(backend: string, candidates: string[]): string {
  const found = candidates
    .map((candidate) => join(backend, "node_modules", candidate))
    .find((candidate) => existsSync(candidate));

  if (!found) {
    throw new Error(`Missing runtime file: ${candidates[0]}`);
  }

  return found;
}

function runNode(backend: string, args: string[]) {
  const result = spawnSync(process.execPath, args, {
    cwd: backend,
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    throw new Error(`Database setup failed (${result.status ?? "signal"})`);
  }
}

let databaseReady = false;

export function prepareDatabase() {
  if (databaseReady) {
    return;
  }

  const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";
  if (!databaseUrl) {
    console.log("DATABASE_URL is unset; skipping migrations and seed.");
    databaseReady = true;
    return;
  }

  const backend = findBackendRoot();
  const prismaCli = [
    join(backend, "node_modules", "prisma", "build", "index.js"),
    join(backend, "node_modules", "prisma", "build", "index.cjs"),
  ].find((candidate) => existsSync(candidate));

  if (!prismaCli) {
    console.log(
      "Prisma CLI is not in the server bundle; migrations run during the build when DATABASE_URL is set.",
    );
    databaseReady = true;
    return;
  }

  const tsxCli = resolveRuntimeFile(backend, [
    "tsx/dist/cli.mjs",
    "tsx/dist/cli.js",
  ]);

  runNode(backend, [prismaCli, "migrate", "deploy"]);
  runNode(backend, [tsxCli, "prisma/seed.ts"]);
  databaseReady = true;
}

let appPromise: Promise<ExpressApp> | undefined;

async function boot(): Promise<ExpressApp> {
  prepareDatabase();
  const app = await createApp();
  return app.getHttpAdapter().getInstance() as ExpressApp;
}

export function handler(req: IncomingMessage, res: ServerResponse) {
  if (!appPromise) {
    appPromise = boot().catch((error) => {
      appPromise = undefined;
      throw error;
    });
  }

  appPromise.then((app) => app(req, res)).catch((error: unknown) => {
    console.error(error);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.end("Server failed to start");
    }
  });
}
