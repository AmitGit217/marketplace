import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { existsSync } from "fs";
import { join, extname } from "path";
import { pathToFileURL } from "url";
import type { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";

const LOCAL_DEV_ORIGIN = "http://localhost:5173";

function sameHost(origin: string, host: string | undefined): boolean {
  if (!host) {
    return false;
  }

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestOrigin = req.header("origin");
  const allowed =
    !requestOrigin ||
    requestOrigin === LOCAL_DEV_ORIGIN ||
    sameHost(requestOrigin, req.header("host"));

  if (requestOrigin && allowed) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,HEAD,POST,PATCH,PUT,DELETE,OPTIONS",
    );
  }

  if (req.method === "OPTIONS" && requestOrigin && allowed) {
    res.sendStatus(204);
    return;
  }

  next();
}

function wantsHtml(req: Request): boolean {
  return (req.headers.accept ?? "").includes("text/html");
}

function findClientDist(): string | undefined {
  return [
    join(__dirname, "..", "..", "client", "dist"),
    join(__dirname, "..", "..", "..", "client", "dist"),
  ].find((candidate) => existsSync(candidate));
}

function findSpaIndex(): string | undefined {
  const candidates = [
    process.env.SPA_INDEX,
    findClientDist() ? join(findClientDist() as string, "index.html") : undefined,
  ].filter((candidate): candidate is string => Boolean(candidate));

  return candidates.find((candidate) => existsSync(candidate));
}

export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(corsMiddleware);

  if (!process.env.JWT_SECRET) {
    console.log(
      "JWT_SECRET is not set; login and authenticated routes will fail until it is configured.",
    );
  }

  const clientDist = findClientDist();
  const spaIndex = findSpaIndex();

  if (clientDist) {
    app.useStaticAssets(clientDist, { index: false });
  }

  if (spaIndex) {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method !== "GET" && req.method !== "HEAD") {
        next();
        return;
      }

      if (!wantsHtml(req)) {
        next();
        return;
      }

      const extension = extname(req.path);
      if (extension && extension !== ".html") {
        next();
        return;
      }

      res.sendFile(spaIndex, { dotfiles: "allow" }, (error) => {
        if (error) {
          next();
        }
      });
    });
  }

  await app.init();
  return app;
}

export async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT ?? "3000";
  await app.listen(port, "0.0.0.0");

  console.log(`Server is running on http://0.0.0.0:${port}`);
}

const entry = process.argv[1];
if (entry && pathToFileURL(entry).href === pathToFileURL(__filename).href) {
  bootstrap();
}
