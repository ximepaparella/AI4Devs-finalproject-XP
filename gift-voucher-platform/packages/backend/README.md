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
   PORT=3000
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
http://localhost:3000/api
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

### Store Endpoints

#### Get All Stores

Retrieves a list of all stores.

- **URL**: `/stores`
- **Method**: `GET`
- **Access**: Public
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c87",
          "name": "Example Store",
          "ownerId": "60d21b4667d0d8992e610c85",
          "email": "store@example.com",
          "phone": "+1234567890",
          "address": "123 Main St, City, Country",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        },
        {
          "_id": "60d21b4667d0d8992e610c88",
          "name": "Another Store",
          "ownerId": "60d21b4667d0d8992e610c86",
          "email": "another.store@example.com",
          "phone": "+0987654321",
          "address": "456 Other St, City, Country",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```

#### Get Store by ID

Retrieves a specific store by ID.

- **URL**: `/stores/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the store
- **Access**: Public
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Example Store",
        "ownerId": "60d21b4667d0d8992e610c85",
        "email": "store@example.com",
        "phone": "+1234567890",
        "address": "123 Main St, City, Country",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format
    - 404 Not Found - Store not found

#### Create Store

Creates a new store.

- **URL**: `/stores`
- **Method**: `POST`
- **Access**: Private/StoreManager
- **Request Body**:
  ```json
  {
    "name": "Example Store",
    "ownerId": "60d21b4667d0d8992e610c85",
    "email": "store@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country"
  }
  ```
- **Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Example Store",
        "ownerId": "60d21b4667d0d8992e610c85",
        "email": "store@example.com",
        "phone": "+1234567890",
        "address": "123 Main St, City, Country",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Validation error or email already exists

#### Update Store

Updates an existing store.

- **URL**: `/stores/:id`
- **Method**: `PUT`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the store
- **Access**: Private/StoreManager
- **Request Body**:
  ```json
  {
    "name": "Updated Store",
    "email": "updated.store@example.com",
    "phone": "+0987654321",
    "address": "456 New St, City, Country"
  }
  ```
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c87",
        "name": "Updated Store",
        "ownerId": "60d21b4667d0d8992e610c85",
        "email": "updated.store@example.com",
        "phone": "+0987654321",
        "address": "456 New St, City, Country",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:15:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format, validation error, or email already in use
    - 404 Not Found - Store not found

#### Delete Store

Deletes a store.

- **URL**: `/stores/:id`
- **Method**: `DELETE`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the store
- **Access**: Private/Admin
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
    - 404 Not Found - Store not found

### Product Endpoints

#### Get All Products

Retrieves a list of all products with optional filtering, sorting, and pagination.

- **URL**: `/products`
- **Method**: `GET`
- **Query Parameters**:
  - `storeId`: Filter products by store ID
  - `sort`: Sort by field (prefix with - for descending order, e.g., -price)
  - `limit`: Number of results per page (default: 10)
  - `page`: Page number (default: 1)
  - `showInactive`: Set to 'true' to include inactive products
- **Access**: Public
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c89",
          "storeId": "60d21b4667d0d8992e610c87",
          "name": "Example Product",
          "description": "This is an example product description",
          "price": 99.99,
          "isActive": true,
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        },
        {
          "_id": "60d21b4667d0d8992e610c90",
          "storeId": "60d21b4667d0d8992e610c87",
          "name": "Another Product",
          "description": "This is another product description",
          "price": 149.99,
          "isActive": true,
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```

#### Get Product by ID

Retrieves a specific product by ID.

- **URL**: `/products/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the product
- **Access**: Public
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c89",
        "storeId": "60d21b4667d0d8992e610c87",
        "name": "Example Product",
        "description": "This is an example product description",
        "price": 99.99,
        "isActive": true,
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format
    - 404 Not Found - Product not found

#### Get Products by Store ID

Retrieves all products for a specific store with optional sorting and pagination.

- **URL**: `/products/store/:storeId`
- **Method**: `GET`
- **URL Parameters**: 
  - `storeId`: MongoDB ObjectId of the store
- **Query Parameters**:
  - `sort`: Sort by field (prefix with - for descending order, e.g., -price)
  - `limit`: Number of results per page (default: 10)
  - `page`: Page number (default: 1)
  - `showInactive`: Set to 'true' to include inactive products
- **Access**: Public
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c89",
          "storeId": "60d21b4667d0d8992e610c87",
          "name": "Example Product",
          "description": "This is an example product description",
          "price": 99.99,
          "isActive": true,
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        },
        {
          "_id": "60d21b4667d0d8992e610c90",
          "storeId": "60d21b4667d0d8992e610c87",
          "name": "Another Product",
          "description": "This is another product description",
          "price": 149.99,
          "isActive": true,
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid store ID format
    - 404 Not Found - Store not found

#### Create Product

Creates a new product.

- **URL**: `/products`
- **Method**: `POST`
- **Access**: Private/StoreManager
- **Request Body**:
  ```json
  {
    "storeId": "60d21b4667d0d8992e610c87",
    "name": "Example Product",
    "description": "This is an example product description",
    "price": 99.99,
    "isActive": true
  }
  ```
- **Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c89",
        "storeId": "60d21b4667d0d8992e610c87",
        "name": "Example Product",
        "description": "This is an example product description",
        "price": 99.99,
        "isActive": true,
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Validation error or invalid store ID
    - 404 Not Found - Store not found

#### Update Product

Updates an existing product.

- **URL**: `/products/:id`
- **Method**: `PUT`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the product
- **Access**: Private/StoreManager
- **Request Body**:
  ```json
  {
    "name": "Updated Product",
    "description": "This is an updated product description",
    "price": 149.99,
    "isActive": true
  }
  ```
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c89",
        "storeId": "60d21b4667d0d8992e610c87",
        "name": "Updated Product",
        "description": "This is an updated product description",
        "price": 149.99,
        "isActive": true,
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:15:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format or validation error
    - 404 Not Found - Product not found

#### Delete Product

Deletes a product.

- **URL**: `/products/:id`
- **Method**: `DELETE`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the product
- **Access**: Private/StoreManager
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
    - 404 Not Found - Product not found

### Voucher Endpoints

#### Get All Vouchers

Retrieves a list of all vouchers with optional filtering, sorting, and pagination.

- **URL**: `/vouchers`
- **Method**: `GET`
- **Query Parameters**:
  - `storeId`: Filter vouchers by store ID
  - `productId`: Filter vouchers by product ID
  - `customerId`: Filter vouchers by customer ID
  - `status`: Filter by status (active, redeemed, expired)
  - `sort`: Sort by field (prefix with - for descending order, e.g., -createdAt)
  - `limit`: Number of results per page (default: 10)
  - `page`: Page number (default: 1)
- **Access**: Private/Admin
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c91",
          "storeId": "60d21b4667d0d8992e610c87",
          "productId": "60d21b4667d0d8992e610c89",
          "customerId": "60d21b4667d0d8992e610c85",
          "code": "ABCD-1234-XYZ9",
          "status": "active",
          "expirationDate": "2024-12-31T23:59:59.999Z",
          "qrCode": "data:image/png;base64,...",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        },
        {
          "_id": "60d21b4667d0d8992e610c92",
          "storeId": "60d21b4667d0d8992e610c87",
          "productId": "60d21b4667d0d8992e610c90",
          "customerId": "60d21b4667d0d8992e610c86",
          "code": "EFGH-5678-ABC1",
          "status": "redeemed",
          "expirationDate": "2024-12-31T23:59:59.999Z",
          "qrCode": "data:image/png;base64,...",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```

#### Get Voucher by ID

Retrieves a specific voucher by ID.

- **URL**: `/vouchers/:id`
- **Method**: `GET`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the voucher
- **Access**: Private
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c91",
        "storeId": "60d21b4667d0d8992e610c87",
        "productId": "60d21b4667d0d8992e610c89",
        "customerId": "60d21b4667d0d8992e610c85",
        "code": "ABCD-1234-XYZ9",
        "status": "active",
        "expirationDate": "2024-12-31T23:59:59.999Z",
        "qrCode": "data:image/png;base64,...",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format
    - 404 Not Found - Voucher not found

#### Get Voucher by Code

Retrieves a specific voucher by its code.

- **URL**: `/vouchers/code/:code`
- **Method**: `GET`
- **URL Parameters**: 
  - `code`: Unique voucher code
- **Access**: Private
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c91",
        "storeId": "60d21b4667d0d8992e610c87",
        "productId": "60d21b4667d0d8992e610c89",
        "customerId": "60d21b4667d0d8992e610c85",
        "code": "ABCD-1234-XYZ9",
        "status": "active",
        "expirationDate": "2024-12-31T23:59:59.999Z",
        "qrCode": "data:image/png;base64,...",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 404 Not Found - Voucher not found

#### Get Vouchers by Store ID

Retrieves all vouchers for a specific store with optional filtering, sorting, and pagination.

- **URL**: `/vouchers/store/:storeId`
- **Method**: `GET`
- **URL Parameters**: 
  - `storeId`: MongoDB ObjectId of the store
- **Query Parameters**:
  - `status`: Filter by status (active, redeemed, expired)
  - `sort`: Sort by field (prefix with - for descending order, e.g., -createdAt)
  - `limit`: Number of results per page (default: 10)
  - `page`: Page number (default: 1)
- **Access**: Private/StoreManager
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 2,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c91",
          "storeId": "60d21b4667d0d8992e610c87",
          "productId": "60d21b4667d0d8992e610c89",
          "customerId": "60d21b4667d0d8992e610c85",
          "code": "ABCD-1234-XYZ9",
          "status": "active",
          "expirationDate": "2024-12-31T23:59:59.999Z",
          "qrCode": "data:image/png;base64,...",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        },
        {
          "_id": "60d21b4667d0d8992e610c92",
          "storeId": "60d21b4667d0d8992e610c87",
          "productId": "60d21b4667d0d8992e610c90",
          "customerId": "60d21b4667d0d8992e610c86",
          "code": "EFGH-5678-ABC1",
          "status": "redeemed",
          "expirationDate": "2024-12-31T23:59:59.999Z",
          "qrCode": "data:image/png;base64,...",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid store ID format
    - 404 Not Found - Store not found

#### Get Vouchers by Customer ID

Retrieves all vouchers for a specific customer with optional filtering, sorting, and pagination.

- **URL**: `/vouchers/customer/:customerId`
- **Method**: `GET`
- **URL Parameters**: 
  - `customerId`: MongoDB ObjectId of the customer
- **Query Parameters**:
  - `status`: Filter by status (active, redeemed, expired)
  - `sort`: Sort by field (prefix with - for descending order, e.g., -createdAt)
  - `limit`: Number of results per page (default: 10)
  - `page`: Page number (default: 1)
- **Access**: Private
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "count": 1,
      "data": [
        {
          "_id": "60d21b4667d0d8992e610c91",
          "storeId": "60d21b4667d0d8992e610c87",
          "productId": "60d21b4667d0d8992e610c89",
          "customerId": "60d21b4667d0d8992e610c85",
          "code": "ABCD-1234-XYZ9",
          "status": "active",
          "expirationDate": "2024-12-31T23:59:59.999Z",
          "qrCode": "data:image/png;base64,...",
          "createdAt": "2023-06-22T19:12:38.657Z",
          "updatedAt": "2023-06-22T19:12:38.657Z"
        }
      ]
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid customer ID format
    - 404 Not Found - Customer not found

#### Create Voucher

Creates a new voucher.

- **URL**: `/vouchers`
- **Method**: `POST`
- **Access**: Private/StoreManager
- **Request Body**:
  ```json
  {
    "storeId": "60d21b4667d0d8992e610c87",
    "productId": "60d21b4667d0d8992e610c89",
    "customerId": "60d21b4667d0d8992e610c85",
    "expirationDate": "2024-12-31T23:59:59.999Z",
    "status": "active"
  }
  ```
- **Response**:
  - **Code**: 201 Created
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c91",
        "storeId": "60d21b4667d0d8992e610c87",
        "productId": "60d21b4667d0d8992e610c89",
        "customerId": "60d21b4667d0d8992e610c85",
        "code": "ABCD-1234-XYZ9",
        "status": "active",
        "expirationDate": "2024-12-31T23:59:59.999Z",
        "qrCode": "data:image/png;base64,...",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:12:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Validation error, invalid ID format, or duplicate voucher code
    - 404 Not Found - Store, product, or customer not found

#### Update Voucher

Updates an existing voucher.

- **URL**: `/vouchers/:id`
- **Method**: `PUT`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the voucher
- **Access**: Private/StoreManager
- **Request Body**:
  ```json
  {
    "customerId": "60d21b4667d0d8992e610c86",
    "status": "active",
    "expirationDate": "2025-12-31T23:59:59.999Z"
  }
  ```
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c91",
        "storeId": "60d21b4667d0d8992e610c87",
        "productId": "60d21b4667d0d8992e610c89",
        "customerId": "60d21b4667d0d8992e610c86",
        "code": "ABCD-1234-XYZ9",
        "status": "active",
        "expirationDate": "2025-12-31T23:59:59.999Z",
        "qrCode": "data:image/png;base64,...",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:15:38.657Z"
      }
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Invalid ID format or validation error
    - 404 Not Found - Voucher or customer not found

#### Delete Voucher

Deletes a voucher.

- **URL**: `/vouchers/:id`
- **Method**: `DELETE`
- **URL Parameters**: 
  - `id`: MongoDB ObjectId of the voucher
- **Access**: Private/StoreManager
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
    - 404 Not Found - Voucher not found

#### Redeem Voucher

Redeems a voucher by its code.

- **URL**: `/vouchers/code/:code/redeem`
- **Method**: `PUT`
- **URL Parameters**: 
  - `code`: Unique voucher code
- **Access**: Private
- **Response**:
  - **Code**: 200 OK
  - **Content**:
    ```json
    {
      "success": true,
      "data": {
        "_id": "60d21b4667d0d8992e610c91",
        "storeId": "60d21b4667d0d8992e610c87",
        "productId": "60d21b4667d0d8992e610c89",
        "customerId": "60d21b4667d0d8992e610c85",
        "code": "ABCD-1234-XYZ9",
        "status": "redeemed",
        "expirationDate": "2024-12-31T23:59:59.999Z",
        "qrCode": "data:image/png;base64,...",
        "createdAt": "2023-06-22T19:12:38.657Z",
        "updatedAt": "2023-06-22T19:15:38.657Z"
      },
      "message": "Voucher successfully redeemed"
    }
    ```
  - **Error Codes**:
    - 400 Bad Request - Voucher already redeemed or expired
    - 404 Not Found - Voucher not found

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

### Store

```typescript
{
  name: string;          // Required
  ownerId: ObjectId;     // Required, reference to User
  email: string;         // Required, unique, valid email format
  phone: string;         // Required
  address: string;       // Required
  createdAt: Date;       // Automatically set
  updatedAt: Date;       // Automatically updated
}
```

### Product

```typescript
{
  storeId: ObjectId;     // Required, reference to Store
  name: string;          // Required
  description: string;   // Required
  price: number;         // Required, min: 0
  isActive: boolean;     // Default: true
  createdAt: Date;       // Automatically set
  updatedAt: Date;       // Automatically updated
}
```

### Voucher

```typescript
{
  storeId: ObjectId;     // Required, reference to Store
  productId: ObjectId;   // Required, reference to Product
  customerId: ObjectId;  // Optional, reference to User (customer)
  code: string;          // Required, unique
  status: string;        // Required, enum: ['active', 'redeemed', 'expired'], default: 'active'
  expirationDate: Date;  // Required
  qrCode: string;        // Required, base64 encoded QR code image
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