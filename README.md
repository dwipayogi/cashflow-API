# Cashflow API Documentation

## Overview

Cashflow API is a RESTful API for managing personal finance including users, transactions, budgets, and categories. Built with Express.js, TypeScript, and Prisma ORM with PostgreSQL database.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Register User

**POST** `/auth/register`

Create a new user account.

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

### Login

**POST** `/auth/login`

Authenticate user and get access token.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

### Get Profile

**GET** `/auth/profile`

Get current user profile (protected route).

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Profile accessed successfully",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "username": "john_doe"
  }
}
```

---

## Category Endpoints

All category endpoints require authentication.

### Create Category

**POST** `/categories`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Food & Dining",
  "description": "Expenses for food and restaurant visits"
}
```

**Response:**

```json
{
  "message": "Category created successfully",
  "category": {
    "id": "uuid",
    "name": "Food & Dining",
    "description": "Expenses for food and restaurant visits",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z"
  }
}
```

### Get All Categories

**GET** `/categories`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Categories retrieved successfully",
  "categories": [
    {
      "id": "uuid",
      "name": "Food & Dining",
      "description": "Expenses for food and restaurant visits",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z",
      "_count": {
        "transactions": 5,
        "budgets": 2
      }
    }
  ]
}
```

### Get Category by ID

**GET** `/categories/{id}`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Category retrieved successfully",
  "category": {
    "id": "uuid",
    "name": "Food & Dining",
    "description": "Expenses for food and restaurant visits",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z",
    "transactions": [...],
    "budgets": [...],
    "_count": {
      "transactions": 5,
      "budgets": 2
    }
  }
}
```

### Update Category

**PUT** `/categories/{id}`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Food & Beverages",
  "description": "Updated description for food category"
}
```

**Response:**

```json
{
  "message": "Category updated successfully",
  "category": {
    "id": "uuid",
    "name": "Food & Beverages",
    "description": "Updated description for food category",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T11:00:00.000Z"
  }
}
```

### Delete Category

**DELETE** `/categories/{id}`

**Headers:**

```
Authorization: Bearer <token>
```

**Response:**

```json
{
  "message": "Category deleted successfully"
}
```

**Note:** Categories with existing transactions or budgets cannot be deleted.

---

## Transaction Endpoints

### Create Transaction

**POST** `/transactions`

Creates a new transaction. If the category doesn't exist, it will be created automatically.

**Request Body:**

```json
{
  "userId": "user-uuid",
  "amount": 5000,
  "description": "Lunch at restaurant",
  "type": "WITHDRAWAL",
  "category": "Food & Dining"
}
```

**Response:**

```json
{
  "message": "Transaction created successfully",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "amount": 5000,
    "description": "Lunch at restaurant",
    "type": "WITHDRAWAL",
    "category": "category-uuid",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "categoryData": {
      "id": "category-uuid",
      "name": "Food & Dining",
      "description": "Auto-generated category: Food & Dining"
    }
  }
}
```

### Get All Transactions

**GET** `/transactions`

**Query Parameters:**

- `userId` (optional): Filter transactions by user ID

**Examples:**

- `/transactions` - Get all transactions
- `/transactions?userId=user-uuid` - Get transactions for specific user

**Response:**

```json
{
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "amount": 5000,
      "description": "Lunch at restaurant",
      "type": "WITHDRAWAL",
      "category": "category-uuid",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z",
      "user": {
        "id": "user-uuid",
        "username": "john_doe",
        "email": "john@example.com"
      },
      "categoryData": {
        "id": "category-uuid",
        "name": "Food & Dining",
        "description": "Auto-generated category: Food & Dining"
      }
    }
  ]
}
```

### Get Transaction by ID

**GET** `/transactions/{id}`

**Response:**

```json
{
  "message": "Transaction retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "amount": 5000,
    "description": "Lunch at restaurant",
    "type": "WITHDRAWAL",
    "category": "category-uuid",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "categoryData": {
      "id": "category-uuid",
      "name": "Food & Dining",
      "description": "Auto-generated category: Food & Dining"
    }
  }
}
```

### Update Transaction

**PUT** `/transactions/{id}`

**Request Body:**

```json
{
  "amount": 7500,
  "description": "Dinner at restaurant",
  "type": "WITHDRAWAL",
  "category": "Dining"
}
```

**Response:**

```json
{
  "message": "Transaction updated successfully",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "amount": 7500,
    "description": "Dinner at restaurant",
    "type": "WITHDRAWAL",
    "category": "new-category-uuid",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T11:00:00.000Z",
    "user": {...},
    "categoryData": {...}
  }
}
```

### Delete Transaction

**DELETE** `/transactions/{id}`

**Response:**

```json
{
  "message": "Transaction deleted successfully"
}
```

---

## Budget Endpoints

### Create Budget

**POST** `/budgets`

Creates a new budget. If the category doesn't exist, it will be created automatically.

**Request Body:**

```json
{
  "userId": "user-uuid",
  "amount": 100000,
  "target": 200000,
  "description": "Monthly food budget",
  "type": "EXPENSE",
  "endDate": "2023-12-31",
  "category": "Food & Dining"
}
```

**Response:**

```json
{
  "message": "Budget created successfully",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "amount": 100000,
    "target": 200000,
    "description": "Monthly food budget",
    "type": "EXPENSE",
    "endDate": "2023-12-31T00:00:00.000Z",
    "category": "category-uuid",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z",
    "user": {
      "id": "user-uuid",
      "username": "john_doe",
      "email": "john@example.com"
    },
    "categoryData": {
      "id": "category-uuid",
      "name": "Food & Dining",
      "description": "Auto-generated category: Food & Dining"
    }
  }
}
```

### Get All Budgets

**GET** `/budgets`

**Query Parameters:**

- `userId` (optional): Filter budgets by user ID

**Examples:**

- `/budgets` - Get all budgets
- `/budgets?userId=user-uuid` - Get budgets for specific user

**Response:**

```json
{
  "message": "Budgets retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "amount": 100000,
      "target": 200000,
      "description": "Monthly food budget",
      "type": "EXPENSE",
      "endDate": "2023-12-31T00:00:00.000Z",
      "category": "category-uuid",
      "createdAt": "2023-12-01T10:00:00.000Z",
      "updatedAt": "2023-12-01T10:00:00.000Z",
      "user": {...},
      "categoryData": {...}
    }
  ]
}
```

### Get Budget by ID

**GET** `/budgets/{id}`

**Response:**

```json
{
  "message": "Budget retrieved successfully",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "amount": 100000,
    "target": 200000,
    "description": "Monthly food budget",
    "type": "EXPENSE",
    "endDate": "2023-12-31T00:00:00.000Z",
    "category": "category-uuid",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T10:00:00.000Z",
    "user": {...},
    "categoryData": {...}
  }
}
```

### Update Budget

**PUT** `/budgets/{id}`

**Request Body:**

```json
{
  "amount": 150000,
  "target": 250000,
  "description": "Updated monthly food budget",
  "type": "EXPENSE",
  "endDate": "2023-12-31",
  "category": "Food & Beverages"
}
```

**Response:**

```json
{
  "message": "Budget updated successfully",
  "data": {
    "id": "uuid",
    "userId": "user-uuid",
    "amount": 150000,
    "target": 250000,
    "description": "Updated monthly food budget",
    "type": "EXPENSE",
    "endDate": "2023-12-31T00:00:00.000Z",
    "category": "new-category-uuid",
    "createdAt": "2023-12-01T10:00:00.000Z",
    "updatedAt": "2023-12-01T11:00:00.000Z",
    "user": {...},
    "categoryData": {...}
  }
}
```

### Delete Budget

**DELETE** `/budgets/{id}`

**Response:**

```json
{
  "message": "Budget deleted successfully"
}
```

---

## Data Models

### User

```typescript
{
  id: string; // UUID
  username: string;
  email: string; // Unique
  password: string; // Hashed
  createdAt: Date;
  updatedAt: Date;
}
```

### Transaction

```typescript
{
  id: string; // UUID
  userId: string; // Foreign key to User
  amount: number; // Optional
  description: string; // Optional
  type: "DEPOSIT" | "WITHDRAWAL";
  category: string; // Foreign key to Category (optional)
  createdAt: Date;
  updatedAt: Date;
}
```

### Budget

```typescript
{
  id: string; // UUID
  userId: string; // Foreign key to User
  amount: number; // Optional, current amount
  target: number; // Optional, target amount
  description: string; // Optional
  type: "SAVINGS" | "EXPENSE";
  endDate: Date; // Optional
  category: string; // Foreign key to Category (optional)
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
{
  id: string; // UUID
  name: string;
  description: string; // Optional
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Error Responses

### 400 Bad Request

```json
{
  "error": "User ID and transaction type are required"
}
```

### 401 Unauthorized

```json
{
  "message": "No token provided"
}
```

### 404 Not Found

```json
{
  "error": "Transaction not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

---

## Features

### Automatic Category Creation

- When creating or updating transactions/budgets with a category name that doesn't exist, the system automatically creates a new category
- Category lookup is case-insensitive to prevent duplicates
- Auto-generated categories include a default description

### Authentication & Authorization

- JWT-based authentication
- Protected routes require valid tokens
- Token expires in 30 days

### Data Relationships

- Users can have multiple transactions and budgets
- Categories can be associated with multiple transactions and budgets
- All responses include related data for better UX

### Validation

- Required field validation
- Duplicate prevention for categories
- Proper error handling throughout

---

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/cashflow_db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3000
```

---

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up database:

```bash
npx prisma generate
npx prisma migrate dev
```

3. Start development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3000`
