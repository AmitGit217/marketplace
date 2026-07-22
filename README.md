# AutoMarket

AutoMarket is a full-stack web application for managing a car dealership. Users can browse available vehicles, search and filter listings, purchase vehicles, and manage their purchase history. Administrators can manage vehicles, customers, and sales through a secure dashboard.

The project was developed as a Full Stack application using **React** for the frontend and **NestJS** for the backend, following modern software architecture and development practices.

---

# Problem

Many dealerships still rely on fragmented systems to manage inventory and sales. AutoMarket centralizes vehicle inventory, customer management, and sales into a single platform, providing an intuitive experience for both customers and administrators.

---

# Target Audience

* Customers looking to browse and purchase vehicles.
* Dealership administrators managing inventory and sales.

---

# Main Features

## Authentication

* User registration
* User login
* JWT authentication
* Password hashing with bcrypt
* Protected routes
* Role-based authorization (Admin / Customer)

---

## Vehicles

* Browse available vehicles
* View vehicle details
* Search by model or brand
* Filter by:

  * Brand
  * Vehicle type
  * Year
  * Price
  * Mileage
  * Fuel type
* Pagination

---

## Customers

* User profile
* Purchase history
* Update personal information

---

## Sales

* Purchase a vehicle
* View sales history
* Vehicle availability updates automatically after purchase

---

## Administration

* Manage vehicles (CRUD)
* Manage customers
* View all sales
* Dashboard with dealership statistics

---

# Database

The application uses **PostgreSQL** with **Prisma ORM**.

## Tables

* Users
* Vehicles
* Sales

## Relationships

* One User can purchase multiple Vehicles.
* One Vehicle can only belong to one Sale.
* One Sale belongs to one User and one Vehicle.

The initial database is automatically populated from CSV files.

---

# Technologies

## Frontend

* React
* React Router
* Chakra UI
* Axios
* React Hook Form

## Backend

* NestJS
* PostgreSQL
* Prisma ORM
* JWT
* bcrypt
* Class Validator
* Multer (optional)
* Cloudinary (optional)

---

# Project Structure

```text
automarket/
│
├── backend/
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── vehicles/
│   │   ├── sales/
│   │   ├── prisma/
│   │   └── common/
│   │
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   │
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── theme/
│   │   └── routes/
│   │
│   └── package.json
│
└── README.md
```

---

# Database Seed

The project includes three CSV files:

* `clientes.csv`
* `vehiculos.csv`
* `ventas.csv`

A custom seed script reads each CSV file using Node.js (`fs`) and imports the data into PostgreSQL using Prisma.

---

# Security

* JWT Authentication
* Password hashing with bcrypt
* Protected API endpoints
* Input validation using DTOs and class-validator

---

# Future Improvements

* Favorites
* Vehicle comparison
* Cloudinary image uploads
* Advanced search filters
* Email notifications
* Stripe payment integration
* Sales analytics dashboard
* Responsive mobile application

---

# Development Principles

* Modular architecture
* RESTful API
* Clean code
* Reusable React components
* Type-safe backend with TypeScript
* SOLID principles
* Responsive UI

---

# Installation

## Backend

```bash
cd backend
npm install
npm run start:dev
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

# Authors

Final Full Stack Project developed with React, NestJS, PostgreSQL, and Prisma.
