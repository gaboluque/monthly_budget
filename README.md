This Web app is a simple monthly budget PWA.

## Overview

This app is a simple monthly budget PWA that allows users to track their monthly income and expenses. The user can use this app to
track their monthly income and expenses, and see how much money they have left over after all expenses are accounted for.

The idea is for the user to be able to set up their monthly budget, and where all their money is going.

## Features

- Add, edit, and delete monthly income sources
  - The user can add a name, amount, and frequency (monthly, bi-weekly, weekly, etc.) for each income source
- Add, edit, and delete monthly expenses
  - The user can add a name, amount, and frequency (monthly, bi-weekly, weekly, etc.) for each expense
  - Each expense should be marked with a category (e.g. housing, transportation, food, etc.) for better organization
    - Default categories should be: Needs, Wants, Savings, Debt, Investment
    - The user should be able to add custom categories
  - Each expense should have a "destination" where the user can specify where to pay or transfer the money
- Reorder category percentages
  - The user should be able to reorder the categories to see how it affects their budget
  - Each category should have a percentage of the total budget

## Technologies

- Remix
- React
- TypeScript
- Tailwind CSS
- Ruby on Rails
- PostgreSQL

## Models

### User

- name: string
- email: string
- password: string
- createdAt: Date
- updatedAt: Date
- auth:
  - token: string
  - expires: Date

### Income

- user: ObjectId<User>
- name: string
- amount: number
- frequency: string
- createdAt: Date
- updatedAt: Date

### Expense

- user: ObjectId<User>
- name: string
- amount: number
- category: string
- destination: string
- frequency: string
- createdAt: Date
- updatedAt: Date
