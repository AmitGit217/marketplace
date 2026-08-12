import csv from "csvtojson";
import path from "path";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import * as bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dataPath = path.join(process.cwd(), "prisma", "data");

  // The file is still called users.csv, but its data represents CLIENTS.
  const clients = await csv().fromFile(
    path.join(dataPath, "users.csv"),
  );

  const vehicles = await csv().fromFile(
    path.join(dataPath, "vehicles.csv"),
  );

  const sales = await csv().fromFile(
    path.join(dataPath, "sales.csv"),
  );

  console.log({
    clients: clients.length,
    vehicles: vehicles.length,
    sales: sales.length,
  });

  // Reset database
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE
      sales,
      vehicles,
      clients,
      users
    RESTART IDENTITY CASCADE;
  `);

  // --------------------------------------------------
  // ADMIN USER
  // --------------------------------------------------

  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("admin123", 10),
      role: "admin",
    },
  });

  // --------------------------------------------------
  // CLIENTS
  // --------------------------------------------------

  const clientIdMap = new Map<number, number>();

  for (const c of clients) {
    const createdClient = await prisma.client.create({
      data: {
        name: c["Nombre del cliente"],
        email: c["Email"] || null,
        preferences: c["Preferencias del cliente"] || null,
      },
    });

    // CSV client ID -> database client ID
    clientIdMap.set(
      Number(c["ID cliente"]),
      createdClient.id,
    );
  }

  // --------------------------------------------------
  // VEHICLES
  // --------------------------------------------------

  const vehiclesData = vehicles.map((v) => ({
    id: v["Número de identificación del vehículo (VIN)"],
    brand: v["Marca"],
    model: v["Modelo"],
    type: v["Tipo de vehículo"],
    manufactureYear: Number(v["Año de fabricación"]),
    mileage: Number(v["Kilometraje"].replace(/\D/g, "")),
    condition: v["Estado"],
    price: Number(v["Precio de venta"].replace(/\D/g, "")),
    acquisitionDate: new Date(v["Fecha de adquisición"]),
    status: v["Estado del vehículo"],
    image: v["Imagen"],
    color: v["Color"],
  }));

  await prisma.vehicle.createMany({
    data: vehiclesData,
  });

  const vehicleIds = new Set(
    vehiclesData.map((v) => v.id),
  );

  // --------------------------------------------------
  // SALES
  // --------------------------------------------------

  const salesData = sales
    .filter((s) => {
      const clientId = clientIdMap.get(
        Number(s["Cliente asociado"]),
      );

      const vehicleId = s["Vehículo vendido"];

      if (!clientId || !vehicleIds.has(vehicleId)) {
        console.log("Skipping invalid sale:", s);
        return false;
      }

      return true;
    })
    .map((s) => ({
      saleDate: new Date(s["Fecha de venta"]),
      paymentMethod: s["Método de pago"],
      deliveryDate: new Date(s["Fecha de entrega"]),

      // The authenticated user who registered the sale
      userId: admin.id,

      // The customer who bought the vehicle
      clientId: clientIdMap.get(
        Number(s["Cliente asociado"]),
      )!,

      vehicleId: s["Vehículo vendido"],
    }));

  await prisma.sale.createMany({
    data: salesData,
  });

  // --------------------------------------------------
  // RESULTS
  // --------------------------------------------------

  console.log({
    usersInserted: await prisma.user.count(),
    clientsInserted: await prisma.client.count(),
    vehiclesInserted: await prisma.vehicle.count(),
    salesInserted: await prisma.sale.count(),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });