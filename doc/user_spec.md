# User API Specification

## Base URL

http://localhost:3000/api

## Create User

Endpoint :

- POST {{BASE_URL}}/user

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ADMIN"
}
```

Response

- Success (200)

```json
{
  "message": "User created successfully",
  "data": {
    "id": "cmbj1uiaw0000tvlo7c6ak28k",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "password": "********",
    "createdAt": "2025-06-05T07:22:56.168Z",
    "updatedAt": "2025-06-14T04:52:25.730Z"
  }
}
```

- Error (400)

```json
{
  "message": "Name cannot be empty",
  "data": null
}
```

## Get List User

Endpoint :

- GET {{BASE_URL}}/user

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
  "message": "Get users success",
  "data": [
    {
      "id": "cmbj1uiaw0000tvlo7c6ak28k",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "password": "********",
      "createdAt": "2025-06-05T07:22:56.168Z",
      "updatedAt": "2025-06-14T04:52:25.730Z"
    },
    {
      "id": "cmbj1uiaw0000tvlo7c6ak28k",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "ADMIN",
      "status": "ACTIVE",
      "password": "********",
      "createdAt": "2025-06-05T07:22:56.168Z",
      "updatedAt": "2025-06-14T04:52:25.730Z"
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

## Get User By ID

Endpoint :

- GET {{BASE_URL}}/user/:id

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

Response

- Success (200)

```json
{
  "message": "Get user success",
  "data": {
    "id": "cmbj1uiaw0000tvlo7c6ak28k",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "password": "********",
    "createdAt": "2025-06-05T07:22:56.168Z",
    "updatedAt": "2025-06-14T04:52:25.730Z"
  }
}
```

- Error (404)

```json
{
  "message": "User not found",
  "data": null
}
```

## Update User By ID

Endpoint :

- PUT {{BASE_URL}}/user/:id

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

- Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ADMIN"
}
```

Response

- Success (200)

```json
{
  "message": "User updated successfully",
  "data": {
    "id": "cmbj1uiaw0000tvlo7c6ak28k",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "password": "********",
    "createdAt": "2025-06-05T07:22:56.168Z",
    "updatedAt": "2025-06-14T04:52:25.730Z"
  }
}
```

- Error (404)

```json
{
  "message": "User not found",
  "data": null
}
```

- Error (400)

```json
{
  "message": "Name cannot be empty",
  "data": null
}
```

## Delete User By ID

Endpoint :

- DELETE {{BASE_URL}}/user/:id

Request

- Header :

  Content-Type: application/json

  Authorization: Bearer {accessToken}

Response

- Success (200)

```json
{
  "message": "User deleted successfully",
  "data": {
    "id": "cmbj1uiaw0000tvlo7c6ak28k",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "ADMIN",
    "status": "ACTIVE",
    "password": "********",
    "createdAt": "2025-06-05T07:22:56.168Z",
    "updatedAt": "2025-06-14T04:52:25.730Z"
  }
}
```

- Error (404)

```json
{
  "message": "User not found",
  "data": null
}
```
