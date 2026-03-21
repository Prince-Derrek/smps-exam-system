# 🏗️ SMPS Exam System: Domain & Data Access Architecture

## 📌 Overview
[cite_start]This document outlines the Core Domain Entities, State Enums, and Repository Interfaces for the SMPS Supplementary Exam System[cite: 78]. The Domain layer has zero dependencies on external frameworks (no Entity Framework, no ASP.NET).

**Rule of Thumb for Backend Team:** You must **never** inject `ApplicationDbContext` directly into your services or commands. Always use the `Interfaces` provided below.

---

## 1️⃣ Base Architecture Rules

* **Soft Deletes:** We do not physically delete records. All entities inherit from `BaseEntity` which includes an `IsDeleted` boolean. The database automatically filters out deleted records.
* **Audit Trails:** `BaseEntity` automatically manages `CreatedAt` and `UpdatedAt` timestamps.
* [cite_start]**Idempotency (Double-Booking Prevention):** The database strictly enforces a Unique Composite Constraint on `(StudentId, ExamUnitId)` in the `Bookings` table[cite: 79, 207, 208]. A student can only have one active booking per unit.

---

## 2️⃣ Domain Entities Dictionary

### Core Actors
| Entity | Primary Key | Key Properties | Navigation / Relationships |
| :--- | :--- | :--- | :--- |
| **Student** | `Id` (Guid) | `RegistrationNumber`, `Email`, `FirstName`, `LastName`, `PasswordHash` | 1-to-Many `Bookings` |
| **Invigilator** | `Id` (Guid) | `StaffNumber`, `Email`, `FullName`, `PasswordHash` | 1-to-Many `ScannedTickets` |

### Academic & Transactional Core
| Entity | Primary Key | Key Properties | Navigation / Relationships |
| :--- | :--- | :--- | :--- |
| **ExamUnit** | `Id` (Guid) | `UnitCode`, `UnitTitle`, `StandardFee` (decimal 18,2) | N/A |
| **Booking** | `Id` (Guid) | `StudentId` (FK), `ExamUnitId` (FK), `Status` (BookingStatus) | 1-to-1 `PaymentRecord`, 1-to-1 `VerificationTicket` |
| **PaymentRecord** | `Id` (Guid) | `BookingId` (FK), `PhoneNumber`, `Amount` (decimal 18,2), `CheckoutRequestId` (String), `MpesaReceiptNumber` (String), `Status` (PaymentStatus) | Belongs to `Booking` |
| **VerificationTicket** | `Id` (Guid) | **Id acts as the Cryptographic Nonce**. `BookingId` (FK), `IsUsed` (Bool), `ScannedAt` (DateTime), `InvigilatorId` (FK) | Belongs to `Booking`, Scanned by `Invigilator` |

---

## 3️⃣ State Machines (Enums)

To ensure strict logical flow, do not use raw strings or booleans for statuses. Use these enums:

### `BookingStatus`
Tracks the student's journey from selection to the exam hall.
1.  **Pending:** Initial state when the unit is selected.
2.  **AwaitingPayment:** M-Pesa STK push triggered, waiting for PIN entry.
3.  **Paid:** Successful callback received from Safaricom.
4.  **Failed:** Payment failed, timed out, or was cancelled.
5.  [cite_start]**Consumed:** The QR code was successfully scanned at the exam venue[cite: 220].

### `PaymentStatus`
Tracks the exact state of the Daraja API transaction.
1.  **Pending:** STK push sent.
2.  [cite_start]**Completed:** ResultCode == 0 (Success)[cite: 115].
3.  **Failed:** ResultCode != 0 (Timeout, invalid PIN).
4.  **Cancelled:** ResultCode == 1032 (User explicitly cancelled the prompt).

---

## 4️⃣ Data Access Contracts (Interfaces)

The Application Layer must use these interfaces to interact with the database. They are implemented in the Infrastructure layer.

### `IUnitOfWork`
Guarantees ACID compliance. Use this to commit transactions.
* `Task<int> SaveChangesAsync(CancellationToken cancellationToken)`

### `IBookingRepository`
* `Task<Booking?> GetByIdAsync(Guid id)`
* `Task<bool> HasExistingBookingAsync(Guid studentId, Guid examUnitId)` *(Use this in your commands to check eligibility before saving)*
* `Task AddAsync(Booking booking)`
* `void Update(Booking booking)`

### `IPaymentRepository`
* `Task<PaymentRecord?> GetByCheckoutRequestIdAsync(string checkoutRequestId)` *(Crucial for the M-Pesa Callback webhook to find the original booking)*
* `Task AddAsync(PaymentRecord payment)`
* `void Update(PaymentRecord payment)`

### `ITicketRepository`
* `Task<VerificationTicket?> GetByIdAsync(Guid ticketId)` *(Used by the scanner to find the ticket by its decrypted Nonce)*
* `Task AddAsync(VerificationTicket ticket)`
* `void Update(VerificationTicket ticket)`

---

## 5️⃣ Common Workflows for Application Developers

1.  **Creating a Booking:** Inject `IBookingRepository` and `IUnitOfWork`. Call `HasExistingBookingAsync()`. If false, map the DTO to a `Booking` entity, call `AddAsync()`, then call `IUnitOfWork.SaveChangesAsync()`.
2.  **Processing M-Pesa Callback:** Inject `IPaymentRepository` and `IUnitOfWork`. Use `GetByCheckoutRequestIdAsync()` to find the pending payment. Update the `PaymentStatus` and the parent `BookingStatus` to `Paid`. Call `SaveChangesAsync()`.
3.  **Verifying a Ticket:** Inject `ITicketRepository`. [cite_start]Extract the `TicketId` (Nonce) from the decrypted QR JWT[cite: 219]. Call `GetByIdAsync()`. [cite_start]Check if `IsUsed == true` (Return 409 Conflict if so)[cite: 221]. Otherwise, set `IsUsed = true`, set `ScannedAt`, set `InvigilatorId`, and `SaveChangesAsync()`.

