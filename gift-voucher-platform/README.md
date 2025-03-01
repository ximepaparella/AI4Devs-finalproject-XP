# Gifty - Gift Voucher Platform

A modern gift voucher platform built with Node.js, Express, MongoDB, and TypeScript following Hexagonal Architecture principles.

## Project Structure

This project is organized as a monorepo using Turborepo:

```
/gift-voucher-platform
├── packages
│   ├── backend (Node.js API)
│   └── frontend (To be added later)
```

## Backend Architecture

The backend follows Hexagonal Architecture (Ports & Adapters) with a Screaming Architecture file organization:

```
/backend
├── src
│   ├── application (use cases)
│   ├── domain (entities, aggregates, domain logic)
│   ├── infrastructure (database, API clients, repositories)
│   ├── interfaces (controllers, HTTP requests, event listeners)
│   ├── config (env variables, database config)
│   ├── server.ts (Express setup)
│   └── app.ts (App entry point)
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v9 or higher)
- MongoDB

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd gift-voucher-platform
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   ```
   cd packages/backend
   cp .env.example .env
   ```
   Edit the `.env` file with your configuration.

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

The API includes the following core modules:

- **Users:** Authentication and user management
- **Vouchers:** CRUD operations for gift vouchers
- **Orders:** Create and retrieve orders
- **Payments:** Integration with MercadoPago
- **Voucher Redemption:** Track voucher usage

## Development

### Available Scripts

- `npm run build` - Build all packages
- `npm run dev` - Start development servers
- `npm run lint` - Run linting
- `npm run test` - Run tests

## Technologies

- **Backend Framework:** Node.js with Express
- **Database:** MongoDB with Mongoose
- **Validation:** Joi
- **Authentication:** JWT
- **Monorepo Management:** Turborepo
- **Code Quality:** ESLint, Prettier
- **Testing:** Jest

## License

This project is licensed under the MIT License. 