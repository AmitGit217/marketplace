import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { AppModule } from "../src/app.module";

describe("Dashboard (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    const login = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123",
      })
      .expect(200);

    adminToken = login.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

  it("get dashboard data", async () => {
    const res = await request(app.getHttpServer())
      .get("/dashboard")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.message).toBe(
      "Dashboard data fetched successfully",
    );

    expect(res.body.data).toBeDefined();

    expect(typeof res.body.data.totalVehicles).toBe("number");
    expect(typeof res.body.data.availableVehicles).toBe("number");
    expect(typeof res.body.data.soldVehicles).toBe("number");
    expect(typeof res.body.data.monthlySales).toBe("number");
    expect(typeof res.body.data.monthlyRevenue).toBe("number");
  });
});