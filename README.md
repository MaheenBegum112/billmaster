# BillMaster: AI-Powered Supermarket Billing, Inventory & Analytics System

BillMaster is an enterprise-grade supermarket billing, inventory management, and business intelligence platform built with React, Vite, Java Spring Boot, Hibernate/JPA, and MySQL. It combines point-of-sale (POS) operations with mathematical and statistical AI models for smart replenishment, sales anomaly detection, and demand forecasting.

---

## 1. System Overview & Features

### Core Modules
* **Public SaaS Web Portal**: High-converting, responsive landing, about, and working contact forms with MySQL persistence.
* **Role-Based Authentication & Authorization**: Dual-tier security (ADMIN and CASHIER) enforced strictly by Spring Security with JWT tokens and database validation.
* **Real-Time POS Billing**: Instant product barcode/name search, live stock verification, atomic database deduction, discount application, and print-ready invoices.
* **Product Catalog & Safe Deletion**: Full CRUD operations for Admin with soft-delete safety guarantees preserving historical invoice integrity.
* **Live Inventory Tracking**: Dynamic velocity tracking, real-time stock thresholds (`IN STOCK`, `LOW STOCK`, `OUT OF STOCK`), and health filtering.
* **Executive Reports & Analytics**: Historical aggregation queries computing daily, weekly, monthly, and yearly revenue and product volume.
* **AI Decision Intelligence**:
  - **Smart Restock Alert**: Statistical restock horizon calculations based on actual sales velocity and safety stock buffers.
  - **Sales Anomaly Detection**: Z-score and historical moving average variance tracking flagging unexpected spikes and sudden drops without generating false claims.
  - **Demand Forecasting**: Weighted Moving Average and linear trend modeling projecting next 7, 14, and 30-day demand with confidence indicators.

---

## 2. Technology Stack

### Frontend
* **Core**: React 18, JSX, JavaScript (ES2023)
* **Build Tooling**: Vite 5
* **Routing**: React Router v6
* **HTTP Client**: Axios (configured with base URL and JWT interceptors)
* **Visualization**: Recharts
* **Iconography**: Lucide React
* **Styling**: Vanilla CSS with modern custom design system tokens

### Backend
* **Runtime**: Java 17+ (JDK 26 runtime compatible)
* **Framework**: Spring Boot 3.3.4
* **Web**: Spring Web (RESTful APIs)
* **Persistence**: Spring Data JPA, Hibernate ORM
* **Security**: Spring Security 6 with JJWT (JSON Web Token)
* **Database Driver**: MySQL Connector/J
* **Build & Dependency Management**: Apache Maven & Maven Wrapper (`mvnw.cmd`)

### Database
* **Engine**: MySQL Server 8.0+
* **Database Name**: `supermarket_db`

---

## 3. Architecture & Folder Structure

```
BillMaster/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components (Navbar, Sidebar, Modal, Toast)
│   │   ├── pages/            # Public & protected views (Home, POS, Inventory, AI)
│   │   ├── services/         # Centralized Axios API services
│   │   ├── layouts/          # Role-based dashboard and public layout wrappers
│   │   ├── hooks/            # Custom React hooks (useAuth, useToast)
│   │   ├── utils/            # Formatting and date helpers
│   │   ├── assets/           # Static media and graphics
│   │   ├── App.jsx           # Main routing configuration
│   │   ├── main.jsx          # DOM entry point
│   │   └── index.css         # Global design system & theme variables
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   └── billing/
│       ├── src/main/java/
│       │   └── com/market/billing/
│       │       ├── controller/   # REST controllers (Auth, POS, Inventory, AI)
│       │       ├── service/      # Business logic and AI statistical services
│       │       ├── repository/   # Spring Data JPA repositories
│       │       ├── model/        # JPA Entities (User, Product, Bill, BillItem)
│       │       ├── dto/          # Request/Response data transfer objects
│       │       ├── exception/    # Global exception handler and custom exceptions
│       │       ├── security/     # JWT filters, UserDetailsService, SecurityConfig
│       │       └── BillingApplication.java
│       │
│       ├── src/main/resources/
│       │   └── application.properties # Server, MySQL, and JWT configuration
│       ├── mvnw.cmd              # Windows Maven wrapper
│       ├── mvnw                  # Unix/macOS Maven wrapper
│       └── pom.xml
│
└── README.md
```

---

## 4. Database Setup & Configuration

1. **Verify MySQL Server**: Ensure MySQL Server 8.0 is running on port 3306.
2. **Database Verification**:
   ```sql
   CREATE DATABASE IF NOT EXISTS supermarket_db;
   USE supermarket_db;
   ```
3. **Database Credentials**:
   Configured in `backend/billing/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/supermarket_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```

---

## 5. Running the Application

### Backend (Spring Boot)
Open a terminal in `BillMaster/backend/billing`:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```
The backend server starts on `http://localhost:8080`.

### Frontend (React + Vite)
Open a terminal in `BillMaster/frontend`:
```bash
npm install
npm run dev
```
The frontend development server starts on `http://localhost:5173`.

---

## 6. Development Phase Tracker

* [x] **PHASE 1**: Project setup, Maven & Vite build verification, folder scaffolding, initial config.
* [ ] **PHASE 2**: Database configuration, JPA entities, relationships, and migrations.
* [ ] **PHASE 3**: Authentication, Spring Security, JWT token filters, and role enforcement.
* [ ] **PHASE 4**: Public website (Landing, About, Contact with backend persistence).
* [ ] **PHASE 5**: Admin and Cashier role-aware layouts, routing guards, and navigation.
* [ ] **PHASE 6**: Product catalog management with safe soft-deletion.
* [ ] **PHASE 7**: POS billing interface, live inventory deduction, and transaction locking.
* [ ] **PHASE 8**: Inventory tracking and velocity monitoring.
* [ ] **PHASE 9**: Invoices and bill history with role-based visibility.
* [ ] **PHASE 10**: Business reports and dashboard analytics.
* [ ] **PHASE 11**: AI Smart Restock Alert model.
* [ ] **PHASE 12**: AI Anomaly Detection engine.
* [ ] **PHASE 13**: AI Demand Forecasting system.
* [ ] **PHASE 14**: AI Insights unified dashboard.
* [ ] **PHASE 15**: System Settings & User Management.
* [ ] **PHASE 16**: UI polishing, accessibility, and responsive validation.
* [ ] **PHASE 17**: End-to-end testing and role boundary verification.
* [ ] **PHASE 18**: Final verification and documentation sign-off.
