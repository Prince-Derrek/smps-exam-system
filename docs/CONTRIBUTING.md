# Contributing to SMPS Exam System

Welcome to the team! This document outlines the standards for contributing to the project.

## 🛠 Getting Started
1. **Clone the Repo:** `git clone <repo-url>`
2. **Checkout Develop:** `git checkout develop`
3. **Install Dependencies:**
   - **Backend:** Restore NuGet packages in Visual Studio.
   - **Frontend:** Run `npm install` in `/frontend`.

## 👩‍💻 Development Workflow
We strictly follow **Gitflow**.
1. **Never commit to `main` or `develop`.**
2. Create a feature branch from `develop`.
3. Work on your feature.
4. Push your branch.
5. Open a Pull Request (PR) to merge into `develop`.

## 🔍 Code Standards

### Backend (.NET 8)
- **Architecture:** STRICTLY follow Clean Architecture layers (Domain -> Application -> Infrastructure -> API).
- **Naming:** PascalCase for public members, camelCase for local variables.
- **Async:** Always use `async/await` for I/O operations.
- **No Magic Strings:** Use Constants or Enums.

### Frontend (React)
- **Functional Components:** Use functional components + Hooks only (No Class components).
- **File Naming:** PascalCase for Components (`BookingWizard.jsx`), camelCase for hooks (`useAuth.js`).
- **State:** Use Context API for global state, local state for UI interactions.

##  pull Request (PR) Process
1. Ensure your code builds locally.
2. Update `README.md` if you added new dependencies or env variables.
3. Your PR title must follow **Conventional Commits**.
4. Request a review from at least one other team member.