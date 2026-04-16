# 🎓 SMPS Exam Management System

![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge&logo=dotnet&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Clean Architecture](https://img.shields.io/badge/Architecture-Clean-success?style=for-the-badge)

A modern, full-stack web application designed to streamline the management, booking, and verification of supplementary university exams. Built with a strict **Clean Architecture** backend and a responsive **React** frontend, the system provides distinct, secure workflows for Administrators, Students, and Invigilators.

---

## ✨ Key Features

### 🛡️ Administrator Portal
- **Analytics Dashboard:** Real-time metrics and a 30-day interactive revenue/booking trend chart.
- **Exam Unit Management:** Create and update supplementary exam units and standard fees.
- **Student Directory:** View all registered students and their booking histories.
- **Financial Reconciliation:** Centralized view of all M-Pesa payment records and statuses.
- **Staff Management:** Register and oversee exam invigilators and their scanning metrics.

### 👨‍🎓 Student Portal
- **Exam Booking:** Browse available supplementary units and seamlessly book exams.
- **Payment Tracking:** Track M-Pesa payment statuses for booked exams.
- **Ticketing System:** Generate verifiable exam tickets upon successful payment.

### 📋 Invigilator Portal
- **Ticket Verification:** Securely verify student exam tickets to prevent fraud.
- **Real-time Validation:** Instantly check if a ticket is paid, valid, or already used.

---

## 🛠️ Technology Stack

**Frontend**
- **Framework:** React + Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios (with central JWT interceptors)
- **UI & Icons:** Lucide React, Custom CSS Variables
- **Charts:** Recharts

**Backend**
- **Framework:** ASP.NET Core Web API (.NET 8)
- **Architecture:** Clean Architecture (Domain, Application, Infrastructure, API)
- **Database:** PostgreSQL
- **ORM:** Entity Framework Core
- **Security:** JWT Authentication, BCrypt Password Hashing

---

## 📁 Project Structure

The repository is divided into two main environments:

```text
SMPS-Exam-System/
├── backend/
│   └── src/
│       ├── SMPS.API/             # Controllers, AppSettings, Middleware
│       ├── SMPS.Application/     # DTOs, Interfaces, Settings
│       ├── SMPS.Domain/          # Entities, Enums, Exceptions
│       └── SMPS.Infrastructure/  # DbContext, Services, EF Migrations
└── frontend/
    ├── public/
    └── src/
        ├── components/           # Reusable UI components (Modals, Tables)
        ├── features/             # Auth Context and specialized logic
        ├── pages/                # Admin, Student, and Invigilator views
        └── services/             # Axios API interceptors and endpoint logic
```

---

## 🚀 Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (v18+)
- [PostgreSQL](https://www.postgresql.org/) (v14+)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend/src/SMPS.API
   ```
2. Update the `appsettings.Development.json` file with your PostgreSQL connection string and JWT Secret Key.
3. Apply Entity Framework migrations to build the database:
   ```bash
   dotnet ef database update --project ../SMPS.Infrastructure --startup-project .
   ```
4. Run the API:
   ```bash
   dotnet run
   ```
   *Note: On first run, the system will automatically seed the default Admin account.*

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the required NPM packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

---

## 🔐 Default Credentials

Upon running the backend for the first time, a default Administrator account is seeded into the database for testing and configuration:

- **Role:** Administrator
- **Email:** `admin@jkuat.ac.ke`
- **Password:** `SuperSecretPassword123!`

*(Please ensure you change these credentials in `appsettings.json` before deploying to production).*

---
*Developed for JKUAT - SMPS Exam System*
```

