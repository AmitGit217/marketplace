import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const backend = path.join(root, "backend");

function run(command, args, cwd) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: "inherit",
      env: process.env,
    });

    child.on("error", reject);
    child.on("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${command} ${args.join(" ")} exited with ${code ?? signal}`,
        ),
      );
    });
  });
}

const databaseUrl = process.env.DATABASE_URL?.trim() ?? "";

if (databaseUrl) {
  await run("npx", ["prisma", "migrate", "deploy"], backend);
  await run("npx", ["tsx", "prisma/seed.ts"], backend);
} else {
  console.log("DATABASE_URL is unset; skipping migrations and seed.");
}

const entry = ["dist/main.js", "dist/src/main.js"].find((candidate) =>
  existsSync(path.join(backend, candidate)),
);

if (!entry) {
  console.error("Nest build output was not found. Run npm run build first.");
  process.exit(1);
}

const server = spawn("node", [entry], {
  cwd: backend,
  stdio: "inherit",
  env: {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || "production",
  },
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.kill(signal);
  });
}

server.on("error", (error) => {
  console.error(error);
  process.exit(1);
});

server.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
