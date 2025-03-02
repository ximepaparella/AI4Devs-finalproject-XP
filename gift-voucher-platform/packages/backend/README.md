# Gift Voucher Platform API

This is the backend API for the Gift Voucher Platform, a system for managing gift vouchers, stores, and users.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB

### Installation

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd gift-voucher-platform/packages/backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```
5. Start the development server:
   ```
   npm run dev
   ```

## API Documentation

### Base URL

```
http://localhost:3001/api
```

### Authentication

Authentication is required for most endpoints. Use the JWT token received from the login endpoint in the Authorization header:

```
Authorization: Bearer <token>
```

### Error Handling

All endpoints return a consistent error format:

```json
{
  "success": false,
  "error": "Error message or array of validation errors"
}
```

### User Endpoints

#### Get All Users

Retrieves a list of all users.

- **URL**: `/users`
- **Method**: `GET`
- **Access**: Admin
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c85",
          "name": "John Doe",
          "email": "john@example.com",
          "role": "customer",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        },
        {
          "_id": "60d21b4667d0d8992e610c86",
          "name": "Jane Smith",
          "email": "jane@example.com",
          "role": "store_manager",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```

#### Get User by ID

Retrieves a specific user by ID.

- **URL**: `/users/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the user
- **Access**: Admin or the user themselves
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format
    - 404 Not Found - User not found

#### Create User

Creates a new user.

- **URL**: `/users`
- **Method**: `POST`
- **Access**: Admin or Public (for customer registration)
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "customer"
  }
  ```
- **Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "customer",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Validation error or email already exists

#### Update User

Updates an existing user.

- **URL**: `/users/:id`
- **Method**: `PUT`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the user
- **Access**: Admin or the user themselves
- **Request Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john.updated@example.com",
    "role": "store_manager"
  }
  ```
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c85",
        "name": "John Updated",
        "email": "john.updated@example.com",
        "role": "store_manager",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:15:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format, validation error, or email already in use
    - 404 Not Found - User not found

#### Delete User

Deletes a user.

- **URL**: `/users/:id`
- **Method**: `DELETE`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the user
- **Access**: Admin
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {}
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format
    - 404 Not Found - User not found

## Data Models

### User

```typescript
{
  name: string;          // Required, 2-50 characters
  email: string;         // Required, unique, valid email format
  password: string;      // Required, min 8 characters (stored hashed)
  role: string;          // Required, enum: ['admin', 'store_manager', 'customer']
  createdAt: Date;       // Automatically set
  updatedAt: Date;       // Automatically updated
}
```

## Postman Collection

A Postman collection is available in the `postman` directory. Import the `gift-voucher-platform.postman_collection.json` file into Postman to test the API endpoints.

## Development

### Running Tests

```
npm test
```

### Linting

```
npm run lint
```

## License

This project is licensed under the MIT License. 