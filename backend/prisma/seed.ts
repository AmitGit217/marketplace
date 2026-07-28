import csv from "csvtojson";
import path from "path";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const dataPath = path.join(process.cwd(), "prisma", "data");

  const users = await csv().fromFile(
    path.join(dataPath, "users.csv")
  );

  const vehicles = await csv().fromFile(
    path.join(dataPath, "vehicles.csv")
  );

  const sales = await csv().fromFile(
    path.join(dataPath, "sales.csv")
  );

  console.log({
    users: users.length,
    vehicles: vehicles.length,
    sales: sales.length,
  });

  await prisma.sale.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();


  // USERS
  const usedEmails = new Set<string>();

  const usersData = users.map((u) => {
    let email = u["Email"];

    if (usedEmails.has(email)) {
      const [name, domain] = email.split("@");
      let counter = 1;

      while (usedEmails.has(`${name}+${counter}@${domain}`)) {
        counter++;
      }

      email = `${name}+${counter}@${domain}`;
    }

    usedEmails.add(email);

    return {
      id: Number(u["ID cliente"]),
      name: u["Nombre del cliente"],
      email,
      preferences: u["Preferencias del cliente"] || null,
    };
  });


  // VEHICLES
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


  // SALES
  const userIds = new Set(usersData.map((u) => u.id));
  const vehicleIds = new Set(vehiclesData.map((v) => v.id));

  const salesData = sales
    .filter((s) => {
      const validUser = userIds.has(Number(s["Cliente asociado"]));
      const validVehicle = vehicleIds.has(s["Vehículo vendido"]);

      if (!validUser || !validVehicle) {
        console.log("Skipping invalid sale:", s);
        return false;
      }

      return true;
    })
    .map((s) => ({
      id: Number(s["ID venta"]),
      saleDate: new Date(s["Fecha de venta"]),
      paymentMethod: s["Método de pago"],
      deliveryDate: new Date(s["Fecha de entrega"]),
      userId: Number(s["Cliente asociado"]),
      vehicleId: s["Vehículo vendido"],
    }));


  await prisma.user.createMany({
    data: usersData,
  });

  await prisma.vehicle.createMany({
    data: vehiclesData,
  });

  await prisma.sale.createMany({
    data: salesData,
  });


  console.log({
    usersInserted: await prisma.user.count(),
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