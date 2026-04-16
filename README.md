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
│   └── SMPS.SupplementaryExamSystem/
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
        ├── services/             # Axios API interceptors and endpoint logic
        ├── assets/               # Static files (images, icons)
        ├── utils/                # Utility functions (formatting, validation)
        └── layout/               # Common layout components (Header, Footer)
        ```