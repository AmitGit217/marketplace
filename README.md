# 🚗 Used Car Marketplace & CRM

## Overview

Used Car Marketplace & CRM is a full-stack web application designed for small used car dealerships that still rely on spreadsheets, paper records, or messaging applications to manage their business.

The platform centralizes vehicle inventory, sales management, customer information, and business analytics into a single modern application.

The goal is to simplify dealership operations while providing an intuitive and responsive user experience.

---

# Problem

Many small dealerships manage their inventory using Excel files and communicate with customers through WhatsApp, making it difficult to:

* Keep vehicle information organized.
* Track completed sales.
* Know current inventory.
* Analyze business performance.
* Access customer purchase history.

This application solves these problems through a centralized management system.

---

# Target Audience

* Small used car dealerships
* Independent vehicle sellers
* Sales teams managing inventory and customers

---

# Main Features

## Authentication

* User registration
* Secure login with JWT
* Role-based authorization
* Protected routes

Roles:

* Administrator
* Salesperson

---

## Dashboard

The dashboard provides a quick overview of dealership activity.

Includes:

* Total vehicles in stock
* Vehicles sold this month
* Monthly revenue
* Recent sales
* Inventory summary

---

## Vehicle Management

Complete inventory management system.

Features:

* Create vehicles
* Edit vehicle information
* Delete vehicles
* Search by brand or model
* Filter vehicles
* Sort results
* View vehicle details
* Vehicle status

Vehicle statuses include:

* Available
* Reserved
* Sold

---

## Sales Management

Sales can be registered directly from the platform.

Each sale stores:

* Customer
* Vehicle
* Sale date
* Delivery date
* Payment method

Once a vehicle is sold, its status is automatically updated.

---

## Customer Management

Each customer has their own profile where the dealership can view:

* Personal information
* Purchase history
* Associated sales

---

## Analytics

Interactive charts display:

* Sales per month
* Revenue
* Inventory statistics
* Most sold brands

---

## Responsive Design

The application is fully responsive and optimized for:

* Desktop
* Tablet
* Mobile

---

## Dark Mode

Users can switch between light and dark themes.

---

# Bonus Features

* Cloudinary image upload
* PDF export for sales reports
* QR code generation for vehicle pages
* Interactive charts using Recharts

---

# Technologies

## Frontend

* React
* React Router
* Chakra UI
* Axios
* React Hook Form
* Zod
* Recharts

---

## Backend

* Node.js
* Express.js
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Bcrypt

---

## Database

The application uses PostgreSQL with Prisma ORM.

Main collections:

* Users
* Vehicles
* Sales

Relationships:

* One user can register multiple sales.
* Each sale belongs to one vehicle.
* Each vehicle can only be sold once.

---

# Database Initialization

The database is populated using CSV files generated from an Excel spreadsheet containing more than 100 records.

The seeding process uses Node.js file system utilities (`fs`) to read the CSV files and insert the data into PostgreSQL using Prisma.

---

# Project Structure

```text
frontend/
│
├── components/
├── pages/
├── hooks/
├── context/
├── services/
├── routes/
├── layouts/
└── assets/

backend/
│
├── controllers/
├── routes/
├── middleware/
├── prisma/
├── services/
├── utils/
└── generated/
```

---

# User Experience

The application focuses on:

* Clean interface
* Fast navigation
* Consistent design
* Responsive layouts
* Easy inventory management
* Minimal number of clicks for common tasks

---

# Future Improvements

* Email notifications
* Vehicle reservation system
* Customer appointments
* Advanced reporting
* Invoice generation
* Vehicle maintenance tracking
* Multi-dealership support

---

# Installation

## Backend

```bash
npm install
npm run dev
```

## Frontend

```bash
npm install
npm run dev
```

---

# Deployment

The project is deployed with separate frontend and backend services.

Production includes:

* Frontend deployment
* Backend API deployment
* PostgreSQL database
* Cloudinary image hosting

---

# Learning Objectives

This project demonstrates the practical application of:

* Full-stack development
* REST API design
* Authentication and authorization
* Relational database modeling
* CSV data seeding
* React architecture
* State management
* Responsive UI design
* Modern backend practices

---

# Author

Developed as the final Full-Stack project using **React**, **Node.js**, **Express**, **Prisma**, and **PostgreSQL**.
