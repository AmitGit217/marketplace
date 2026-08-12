import csv from "csvtojson";
import path from "path";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import * as bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

// --------------------------------------------------
// CONFIGURATION
// --------------------------------------------------

const MINIMUM_AVAILABLE_VEHICLES = 15;

const SALES_PER_YEAR: Record<number, number> = {
  2023: 5,
  2024: 8,
  2025: 12,
  2026: 8,
};

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRandomDate(
  startDate: Date,
  endDate: Date,
): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();

  if (end < start) {
    throw new Error(
      `Invalid date range: ${startDate.toISOString()} - ${endDate.toISOString()}`,
    );
  }

  return new Date(
    start + Math.random() * (end - start),
  );
}

function createSaleDate(year: number): Date {
  const startOfYear = new Date(
    year,
    0,
    1,
    0,
    0,
    0,
    0,
  );

  let endOfYear: Date;

  if (year === new Date().getFullYear()) {
    // Never generate a future sale.
    endOfYear = new Date();
  } else {
    endOfYear = new Date(
      year,
      11,
      31,
      23,
      59,
      59,
      999,
    );
  }

  return createRandomDate(
    startOfYear,
    endOfYear,
  );
}

function createDeliveryDate(
  saleDate: Date,
): Date {
  const deliveryDate = new Date(saleDate);

  deliveryDate.setDate(
    deliveryDate.getDate() +
      randomInt(1, 7),
  );

  return deliveryDate;
}

function generateDemoVehicle(
  index: number,
) {
  const brands = [
    "Toyota",
    "BMW",
    "Audi",
    "Ford",
    "Volkswagen",
  ];

  const models = [
    "Corolla",
    "320i",
    "A4",
    "Focus",
    "Golf",
  ];

  const colors = [
    "White",
    "Black",
    "Grey",
    "Blue",
  ];

  return {
    id: `DEMO-${Date.now()}-${index}-${Math.random()
      .toString(36)
      .substring(2, 8)}`,

    brand: randomItem(brands),

    model: randomItem(models),

    type: "Sedan",

    manufactureYear: randomInt(
      2022,
      2026,
    ),

    mileage: randomInt(
      0,
      100000,
    ),

    condition: "Used",

    price: randomInt(
      15000,
      45000,
    ),

    acquisitionDate: new Date(
      "2025-01-01",
    ),

    status: "Available",

    image:
      "https://example.com/car.jpg",

    color: randomItem(colors),
  };
}

// --------------------------------------------------
// MAIN
// --------------------------------------------------

async function main() {
  const dataPath = path.join(
    process.cwd(),
    "prisma",
    "data",
  );

  // --------------------------------------------------
  // LOAD CSV DATA
  // --------------------------------------------------

  // users.csv contains the client data.
  const clients = await csv().fromFile(
    path.join(
      dataPath,
      "users.csv",
    ),
  );

  const vehicles = await csv().fromFile(
    path.join(
      dataPath,
      "vehicles.csv",
    ),
  );

  const sales = await csv().fromFile(
    path.join(
      dataPath,
      "sales.csv",
    ),
  );

  console.log({
    clients: clients.length,
    vehicles: vehicles.length,
    sales: sales.length,
  });

  // --------------------------------------------------
  // RESET DATABASE
  // --------------------------------------------------
  //
  // Remove this section if existing database data
  // must be preserved.
  //
  // --------------------------------------------------

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
      password: await bcrypt.hash(
        "admin123",
        10,
      ),
      role: "admin",
    },
  });

  // --------------------------------------------------
  // CLIENTS
  // --------------------------------------------------

  const clientIdMap =
    new Map<number, number>();

  for (const c of clients) {
    const csvClientId = Number(
      c["ID cliente"],
    );

    const createdClient =
      await prisma.client.create({
        data: {
          name:
            c["Nombre del cliente"],

          email:
            c["Email"] || null,

          preferences:
            c[
              "Preferencias del cliente"
            ] || null,
        },
      });

    clientIdMap.set(
      csvClientId,
      createdClient.id,
    );
  }

  // --------------------------------------------------
  // VEHICLES FROM CSV
  // --------------------------------------------------

  const vehiclesData = vehicles.map(
    (v) => ({
      id:
        v[
          "Número de identificación del vehículo (VIN)"
        ],

      brand:
        v["Marca"],

      model:
        v["Modelo"],

      type:
        v["Tipo de vehículo"],

      manufactureYear:
        Number(
          v["Año de fabricación"],
        ),

      mileage:
        Number(
          v["Kilometraje"].replace(
            /\D/g,
            "",
          ),
        ),

      condition:
        v["Estado"],

      price:
        Number(
          v["Precio de venta"].replace(
            /\D/g,
            "",
          ),
        ),

      acquisitionDate:
        new Date(
          v["Fecha de adquisición"],
        ),

      status:
        "Available",

      image:
        v["Imagen"],

      color:
        v["Color"],
    }),
  );

  await prisma.vehicle.createMany({
    data: vehiclesData,
  });

  // --------------------------------------------------
  // VEHICLE IDS
  // --------------------------------------------------

  const vehicleIds =
    new Set<string>(
      vehiclesData.map(
        (vehicle) => vehicle.id,
      ),
    );

  // --------------------------------------------------
  // HISTORICAL CSV SALES
  // --------------------------------------------------

  const salesData = sales
    .filter((s) => {
      const clientId =
        clientIdMap.get(
          Number(
            s["Cliente asociado"],
          ),
        );

      const vehicleId =
        s["Vehículo vendido"];

      if (
        !clientId ||
        !vehicleIds.has(
          vehicleId,
        )
      ) {
        console.log(
          "Skipping invalid historical sale:",
          s,
        );

        return false;
      }

      return true;
    })
    .map((s) => ({
      saleDate:
        new Date(
          s["Fecha de venta"],
        ),

      paymentMethod:
        s["Método de pago"],

      deliveryDate:
        new Date(
          s["Fecha de entrega"],
        ),

      userId:
        admin.id,

      clientId:
        clientIdMap.get(
          Number(
            s["Cliente asociado"],
          ),
        )!,

      vehicleId:
        s["Vehículo vendido"],
    }));

  // --------------------------------------------------
  // INSERT HISTORICAL SALES
  // --------------------------------------------------

  if (salesData.length > 0) {
    await prisma.sale.createMany({
      data: salesData,
    });
  }

  // --------------------------------------------------
  // DETERMINE SOLD VEHICLES
  // --------------------------------------------------

  const soldVehicleIds =
    new Set<string>(
      salesData.map(
        (sale) => sale.vehicleId,
      ),
    );

  // --------------------------------------------------
  // DETERMINE AVAILABLE VEHICLES
  // --------------------------------------------------

  let availableVehicleIds =
    vehiclesData
      .map(
        (vehicle) =>
          vehicle.id,
      )
      .filter(
        (vehicleId) =>
          !soldVehicleIds.has(
            vehicleId,
          ),
      );

  // --------------------------------------------------
  // CREATE EXTRA VEHICLES IF NEEDED
  // --------------------------------------------------

  if (
    availableVehicleIds.length <
    MINIMUM_AVAILABLE_VEHICLES
  ) {
    const vehiclesToCreate =
      MINIMUM_AVAILABLE_VEHICLES -
      availableVehicleIds.length;

    const extraVehicles =
      Array.from(
        {
          length:
            vehiclesToCreate,
        },
        (_, index) =>
          generateDemoVehicle(
            index,
          ),
      );

    await prisma.vehicle.createMany({
      data: extraVehicles,
    });

    availableVehicleIds.push(
      ...extraVehicles.map(
        (vehicle) =>
          vehicle.id,
      ),
    );

    console.log(
      `Created ${vehiclesToCreate} additional vehicles.`,
    );
  }

  // --------------------------------------------------
  // RESERVE VEHICLES THAT MUST STAY AVAILABLE
  // --------------------------------------------------

  const vehiclesToKeepAvailable =
    availableVehicleIds.slice(
      0,
      MINIMUM_AVAILABLE_VEHICLES,
    );

  const vehiclesAvailableForSale =
    availableVehicleIds.slice(
      MINIMUM_AVAILABLE_VEHICLES,
    );

  // --------------------------------------------------
  // GENERATE ADDITIONAL SALES
  // --------------------------------------------------

  const generatedSalesData: Array<{
    saleDate: Date;
    paymentMethod: string;
    deliveryDate: Date;
    userId: number;
    clientId: number;
    vehicleId: string;
  }> = [];

  const clientIds =
    Array.from(
      clientIdMap.values(),
    );

  let vehicleIndex = 0;

  for (
    const [
      yearString,
      numberOfSales,
    ] of Object.entries(
      SALES_PER_YEAR,
    )
  ) {
    const year =
      Number(yearString);

    for (
      let i = 0;
      i < numberOfSales;
      i++
    ) {
      // Never sell one of the reserved
      // available vehicles.
      if (
        vehicleIndex >=
        vehiclesAvailableForSale.length
      ) {
        console.warn(
          `Not enough vehicles to generate all ${year} sales.`,
        );

        break;
      }

      const vehicleId =
        vehiclesAvailableForSale[
          vehicleIndex
        ];

      vehicleIndex++;

      // ----------------------------------------------
      // SALE DATE
      // ----------------------------------------------

      const saleDate =
        createSaleDate(year);

      // ----------------------------------------------
      // DELIVERY DATE
      // ----------------------------------------------

      const deliveryDate =
        createDeliveryDate(
          saleDate,
        );

      // ----------------------------------------------
      // RANDOM CLIENT
      // ----------------------------------------------

      if (
        clientIds.length === 0
      ) {
        throw new Error(
          "Cannot generate sales: no clients exist.",
        );
      }

      const clientId =
        randomItem(clientIds);

      // ----------------------------------------------
      // PAYMENT METHOD
      // ----------------------------------------------

      const paymentMethod =
        randomItem([
          "Cash",
          "Card",
          "Bank Transfer",
        ]);

      generatedSalesData.push({
        saleDate,

        paymentMethod,

        deliveryDate,

        userId:
          admin.id,

        clientId,

        vehicleId,
      });
    }
  }

  // --------------------------------------------------
  // INSERT GENERATED SALES
  // --------------------------------------------------

  if (
    generatedSalesData.length > 0
  ) {
    await prisma.sale.createMany({
      data:
        generatedSalesData,
    });
  }

  // --------------------------------------------------
  // MARK ALL SOLD VEHICLES
  // --------------------------------------------------

  const generatedSoldVehicleIds =
    generatedSalesData.map(
      (sale) =>
        sale.vehicleId,
    );

  const allSoldVehicleIds =
    Array.from(
      new Set([
        ...soldVehicleIds,
        ...generatedSoldVehicleIds,
      ]),
    );

  if (
    allSoldVehicleIds.length > 0
  ) {
    await prisma.vehicle.updateMany({
      where: {
        id: {
          in: allSoldVehicleIds,
        },
      },

      data: {
        status: "Sold",
      },
    });
  }

  // --------------------------------------------------
  // FINAL VERIFICATION
  // --------------------------------------------------

  const finalTotalVehicles =
    await prisma.vehicle.count();

  const finalAvailableVehicles =
    await prisma.vehicle.count({
      where: {
        status: "Available",
      },
    });

  const finalSoldVehicles =
    await prisma.vehicle.count({
      where: {
        status: "Sold",
      },
    });

  const finalSales =
    await prisma.sale.count();

  // --------------------------------------------------
  // VERIFY YEARLY GENERATED SALES
  // --------------------------------------------------

  const yearlyGeneratedSales =
    generatedSalesData.reduce(
      (
        result,
        sale,
      ) => {
        const year =
          sale.saleDate.getFullYear();

        result[year] =
          (result[year] || 0) + 1;

        return result;
      },
      {} as Record<
        number,
        number
      >,
    );

  // --------------------------------------------------
  // OUTPUT
  // --------------------------------------------------

  console.log(
    "\n========== SEED COMPLETE ==========\n",
  );

  console.log({
    usersInserted: 1,

    clientsInserted:
      clients.length,

    vehiclesFromCsv:
      vehiclesData.length,

    historicalSales:
      salesData.length,

    generatedSales:
      generatedSalesData.length,

    totalSales:
      finalSales,

    totalVehicles:
      finalTotalVehicles,

    availableVehicles:
      finalAvailableVehicles,

    soldVehicles:
      finalSoldVehicles,

    reservedAvailableVehicles:
      vehiclesToKeepAvailable.length,

    yearlyGeneratedSales,
  });

  console.log(
    "\nExpected generated sales:",
  );

  console.log({
    2023:
      SALES_PER_YEAR[2023],

    2024:
      SALES_PER_YEAR[2024],

    2025:
      SALES_PER_YEAR[2025],

    2026:
      SALES_PER_YEAR[2026],
  });

  console.log(
    "\n===================================\n",
  );
}

// --------------------------------------------------
// RUN
// --------------------------------------------------

main()
  .catch((error) => {
    console.error(
      "Seed failed:",
      error,
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });