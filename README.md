# FinTech Wallet & Payment System

A full-stack FinTech Wallet and Payment System built using **Java Spring Boot** and **React**. The application provides users with a digital wallet experience for managing balances, transferring money, viewing transactions, and managing their profiles.

## 🚀 Overview

The FinTech Wallet & Payment System is designed as a full-stack application that demonstrates how a digital wallet and payment platform can be developed using modern backend and frontend technologies.

The system provides separate frontend and backend applications that communicate through REST APIs.

### Key capabilities

- User registration and login
- User authentication
- Digital wallet management
- Wallet balance management
- Money transfers between users
- Transaction management
- Transaction history
- User profile management
- Payment processing
- RESTful API-based backend
- Responsive React frontend

---

## 🏗️ Project Architecture

```text
fintech-wallet-payment-system/
│
├── fintech-wallet Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/fintechwallet/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   ├── test/
│   │   └── ...
│   │
│   ├── pom.xml
│   ├── mvnw
│   └── README.md
│
├── fintech-wallet-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
