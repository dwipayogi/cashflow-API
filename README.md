# Cashflow API

A RESTful API for managing personal finances, budgeting, and transaction tracking.

## Overview

The Cashflow API provides endpoints for managing users, transactions, categories, and budgeting data. It's built with TypeScript and Bun, using Prisma as the ORM for database interactions.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.1.43 or higher
- Database (PostgreSQL recommended, see Prisma schema)

### Installation

To install dependencies:

```bash
bun install
```

### Environment Setup

Create a `.env` file in the root directory with the following variables:
```bash
DATABASE_URL="your database url"
```

### Run

To run this project:

```bash
bun run dev
```

Access the server on http://localhost:3000