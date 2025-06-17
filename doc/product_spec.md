# Product API Specification

## Base URL

http://localhost:3000/api

## Create Product

Endpoint :

- POST {{BASE_URL}}/product

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Request Body

```json
{
  "sku": "sku-001",
  "name": "baju murah",
  "ptName": "PT. AAA",
  "description": "baju murah",
  "stock": 20
}
```

Response

- Success (200)

```json
{
  "message": "Product created successfully",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 20,
    "status": "ACTIVE",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (400)

```json
{
  "message": "Product sku is required",
  "data": null
}
```

## Get List Product

Endpoint :

- GET {{BASE_URL}}/product

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Query Params

  - page: number
  - perPage: number

Response

- Success (200)

```json
{
  "message": "Get products success",
  "data": [
    {
      "id": "cmbw1h1e7000ctvc0vuylr907",
      "sku": "sku-001",
      "name": "baju murah",
      "ptName": "PT. AAA",
      "description": "baju murah",
      "stock": 20,
      "status": "ACTIVE",
      "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
      "createdAt": "2025-06-14T09:33:28.015Z",
      "updatedAt": "2025-06-14T09:33:28.015Z"
    },
    {
      "id": "cmbw1h1e7000ctvc0vuylr907",
      "sku": "sku-001",
      "name": "baju murah",
      "ptName": "PT. AAA",
      "description": "baju murah",
      "stock": 20,
      "status": "ACTIVE",
      "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
      "createdAt": "2025-06-14T09:33:28.015Z",
      "updatedAt": "2025-06-14T09:33:28.015Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalPages": 1,
    "totalItems": 1
  }
}
```

## Get Product By Id

Endpoint :

- GET {{BASE_URL}}/product/:id

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

Response

- Success (200)

```json
{
  "message": "Get product success",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 20,
    "status": "ACTIVE",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (404)

```json
{
  "message": "Product not found",
  "data": null
}
```

## Update Product By Id

Endpoint :

- PUT {{BASE_URL}}/product/:id

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Request Body

```json
{
  "sku": "sku-001",
  "name": "baju murah",
  "ptName": "PT. AAA",
  "description": "baju murah"
}
```

Response

- Success (200)

```json
{
  "message": "Product updated successfully",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 20,
    "status": "ACTIVE",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (404)

```json
{
  "message": "Product not found",
  "data": null
}
```

- Error (400)

```json
{
  "message": "Product sku is required",
  "data": null
}
```

## Delete Product By Id

Endpoint :

- DELETE {{BASE_URL}}/product/:id

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

Response

- Success (200)

```json
{
  "message": "Product deleted successfully",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 20,
    "status": "DELETED",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (404)

```json
{
  "message": "Product not found",
  "data": null
}
```

## Product Restore By Id

Endpoint :

- PATCH {{BASE_URL}}/product/:id/restore

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

Response

- Success (200)

```json
{
  "message": "Product restored successfully",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 20,
    "status": "ACTIVE",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (404)

```json
{
  "message": "Product not found",
  "data": null
}
```

## Product Stock In

Endpoint :

- POST {{BASE_URL}}/product/:id/stock-in

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Request Body

```json
{
  "quantity": 10
}
```

Response

- Success (200)

```json
{
  "message": "Product stock in successfully",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 30,
    "status": "ACTIVE",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (404)

```json
{
  "message": "Product not found",
  "data": null
}
```

- Error (400)

```json
{
  "message": "Invalid productId or quantity",
  "data": null
}
```

## Product Stock Out

Endpoint :

- POST {{BASE_URL}}/product/:id/stock-out

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Request Body

```json
{
  "quantity": 10
}
```

Response

- Success (200)

```json
{
  "message": "Product stock out successfully",
  "data": {
    "id": "cmbw1h1e7000ctvc0vuylr907",
    "sku": "sku-001",
    "name": "baju murah",
    "ptName": "PT. AAA",
    "description": "baju murah",
    "stock": 10,
    "status": "ACTIVE",
    "createdBy": "cmbj1uiaw0000tvlo7c6ak28k",
    "createdAt": "2025-06-14T09:33:28.015Z",
    "updatedAt": "2025-06-14T09:33:28.015Z"
  }
}
```

- Error (404)

```json
{
  "message": "Product not found",
  "data": null
}
```

- Error (400)

```json
{
  "message": "Insufficient stock",
  "data": null
}
```

## Product History

Endpoint :

- POST {{BASE_URL}}/product/:id/history

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Query Params

  - page: number
  - perPage: number

- Request Body

```json
{
  "message": "Get products success",
  "data": [
    {
      "id": "cmbw1w5i8000gtvc0i47ha2g8",
      "productId": "cmbvtcr1j0002tvc0yi7n9kxl",
      "name": "baju baru 2",
      "action": "STOCK_IN",
      "quantity": 10,
      "stockBefore": 20,
      "stockAfter": 30,
      "description": "Stock increased by 10",
      "changedBy": "manager",
      "changedAt": "2025-06-14T09:45:13.185Z"
    },
    {
      "id": "cmbvtfjwz0006tvc0nbbwv2b7",
      "productId": "cmbvtcr1j0002tvc0yi7n9kxl",
      "name": "baju baru 2",
      "action": "STOCK_IN",
      "quantity": 10,
      "stockBefore": 20,
      "stockAfter": 30,
      "description": "Stock increased by 10",
      "changedBy": "manager",
      "changedAt": "2025-06-14T05:48:21.779Z"
    },
    {
      "id": "cmbvtcr1m0004tvc0ry6096m5",
      "productId": "cmbvtcr1j0002tvc0yi7n9kxl",
      "name": "baju baru 2",
      "action": "CREATED",
      "quantity": 20,
      "stockBefore": 0,
      "stockAfter": 20,
      "description": "Initial stock: 20",
      "changedBy": "manager",
      "changedAt": "2025-06-14T05:46:11.050Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "perPage": 10,
    "totalPages": 1,
    "totalItems": 3
  }
}
```
