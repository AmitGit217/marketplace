import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { AppModule } from "../src/app.module";

describe("Vehicles (e2e)", () => {
  let app: INestApplication;
  let adminToken: string;
  let vehicleId: string;

const vehicle = {
  brand: "Toyota",
  model: "Corolla",
  type: "Sedan",
  manufactureYear: 2023,
  mileage: 12000,
  condition: "Used",
  price: "25000.00",
  acquisitionDate: "2026-07-31T00:00:00.000Z",
  status: "Available",
  image: "https://example.com/car.jpg",
  color: "White",
};

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

    const res = await request(app.getHttpServer())
      .post("/auth/login")
      .send({
        email: "admin@example.com",
        password: "admin123",
      })
      .expect(200);

    adminToken = res.body.token;
  });

  afterAll(async () => {
    await app.close();
  });

 it("create vehicle", async () => {
  const res = await request(app.getHttpServer())
    .post("/vehicles")
    .set("Authorization", `Bearer ${adminToken}`)
    .send(vehicle)
    .expect(201);

  

  vehicleId = res.body.id;

  return;
});

  it("get vehicles", async () => {
    const res = await request(app.getHttpServer())
      .get("/vehicles")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
  });

  it("get vehicle by id", async () => {
    const res = await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(res.body.id).toBe(vehicleId);
    expect(res.body.brand).toBe(vehicle.brand);
  });

  it("update vehicle", async () => {
    const res = await request(app.getHttpServer())
      .patch(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        price: "30000",
      })
      .expect(200);

    expect(res.body.price).toBe("30000");
  });

  it("delete vehicle", async () => {
    await request(app.getHttpServer())
      .delete(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);
  });

  it("vehicle should not exist after delete", async () => {
    await request(app.getHttpServer())
      .get(`/vehicles/${vehicleId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);
  });
});