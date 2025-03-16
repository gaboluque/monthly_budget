# Monthly Budget PWA 📊

[![Rails](https://img.shields.io/badge/Rails-8.x-blue.svg)](https://rubyonrails.org/)
[![Remix](https://img.shields.io/badge/Remix-1.x-blue.svg)](https://remix.run/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13.x-336791.svg)](https://www.postgresql.org/)

## 📝 Overview

A modern Progressive Web App (PWA) for managing your monthly budget effectively. Track your income sources and expenses, categorize your spending, and maintain a clear view of your financial health.

### 🎯 Purpose

This app helps you:

- Track monthly income and expenses
- Monitor where your money is going
- Calculate remaining budget after expenses
- Manage recurring financial commitments

## ✨ Features

### 💰 Income Management

- **Add, Edit, and Delete Income Sources**
  - Track income with name and amount
  - Multiple frequency options:
    - `Monthly`, `Bi-weekly`, `Weekly`, `Daily`, `Yearly`, `Quarterly`
  - Smart monthly amount auto-calculation based on frequency

### 💸 Expense Management

- **Comprehensive Expense Tracking**
  - Create, update, and remove expenses
  - Flexible frequency options:
    `Monthly`, `Bi-weekly`, `Weekly`
  - Smart categorization system
    ```
    📊 Default Categories:
    ├── Needs
    ├── Wants
    ├── Savings
    ├── Debt
    └── Investment
    ```
  - Destination tracking for payments
  - Payment history with last_expensed_at tracking

### 📊 Analysis & Organization

- **Smart Filtering & Views**
  - Filter expenses by category
  - Filter by frequency
  - Track pending expenses for current month

## 📚 Data Models

### 👤 User

```
User {
  email: string           // unique, required
  password_digest: string // required
  createdAt: datetime
  updatedAt: datetime

  // Relationships
  has_many: incomes
  has_many: expenses
}
```

### 💵 Income

```
Income {
  user_id: references    // required, foreign key
  name: string          // required
  amount: decimal       // required, precision: 10, scale: 2
  frequency: string     // required, enum of supported frequencies
  createdAt: datetime
  updatedAt: datetime
}
```

### 💳 Expense

```
Expense {
  user_id: references    // required, foreign key
  name: string          // required
  amount: decimal       // required, precision: 10, scale: 2
  category: string      // required
  destination: string   // required
  frequency: string     // required, enum of supported frequencies
  last_expensed_at: datetime  // nullable
  createdAt: datetime
  updatedAt: datetime
}
```

### Accounts

```
Account {
  user_id: references    // required, foreign key
  name: string          // required
  balance: decimal      // required, precision: 10, scale: 2
  type: string          // required, enum of supported account types (e.g., Checking, Savings, Credit Card, loan, etc)
  currency: string      // required, enum of supported currencies (e.g., USD, COP) - default: COP
  description: text     // nullable
  createdAt: datetime
  updatedAt: datetime
}
```
