const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UrbanGroom E-Commerce API Docs",
      version: "1.0.0",
      description: "API specification for the UrbanGroom Grooming E-commerce backend."
    },
    servers: [
      {
        url: "https://urbangroom-ecommerce-backend.onrender.com",
        description: "Production Server (Render)"
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Server"
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token in the format: Bearer <token>"
        }
      }
    },
    paths: {
      "/api/auth/register": {
        "post": {
          "tags": ["Authentication"],
          "summary": "Register a new user",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["name", "email", "password"],
                  "properties": {
                    "name": { "type": "string", "example": "John Doe" },
                    "email": { "type": "string", "example": "johndoe@example.com" },
                    "password": { "type": "string", "example": "password123" },
                    "avatar": { "type": "string", "example": "https://example.com/avatar.png" }
                  }
                }
              }
            }
          },
          "responses": {
            "201": { "description": "User created successfully" },
            "400": { "description": "Invalid input or user already exists" }
          }
        }
      },
      "/api/auth/login": {
        "post": {
          "tags": ["Authentication"],
          "summary": "Authenticate user & get JWT token",
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["email", "password"],
                  "properties": {
                    "email": { "type": "string", "example": "johndoe@example.com" },
                    "password": { "type": "string", "example": "password123" }
                  }
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Login successful" },
            "401": { "description": "Invalid credentials" }
          }
        }
      },
      "/api/auth/logout": {
        "post": {
          "tags": ["Authentication"],
          "summary": "Logout user and clear cookie",
          "responses": {
            "200": { "description": "Logged out successfully" }
          }
        }
      },
      "/api/auth/me": {
        "get": {
          "tags": ["Authentication"],
          "summary": "Get current logged-in user profile",
          "security": [{ "bearerAuth": [] }],
          "responses": {
            "200": { "description": "Profile data retrieved" },
            "401": { "description": "Unauthorized" }
          }
        }
      },
      "/api/auth/profile": {
        "put": {
          "tags": ["Authentication"],
          "summary": "Update user profile details, password or address list",
          "security": [{ "bearerAuth": [] }],
          "requestBody": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "name": { "type": "string", "example": "John Smith" },
                    "avatar": { "type": "string" },
                    "password": { "type": "string" },
                    "address": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "street": { "type": "string" },
                          "city": { "type": "string" },
                          "state": { "type": "string" },
                          "postalCode": { "type": "string" },
                          "country": { "type": "string" },
                          "phone": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Profile updated successfully" },
            "401": { "description": "Unauthorized" }
          }
        }
      },
      "/api/products": {
        "get": {
          "tags": ["Products"],
          "summary": "Fetch all products with filtering, search, sorting and pagination",
          "parameters": [
            { "name": "search", "in": "query", "schema": { "type": "string" }, "description": "Search keyword matching name" },
            { "name": "category", "in": "query", "schema": { "type": "string" }, "description": "Product category" },
            { "name": "subCategory", "in": "query", "schema": { "type": "string" } },
            { "name": "minPrice", "in": "query", "schema": { "type": "number" } },
            { "name": "maxPrice", "in": "query", "schema": { "type": "number" } },
            { "name": "sort", "in": "query", "schema": { "type": "string", "enum": ["priceAsc", "priceDesc", "ratings", "newest"] } },
            { "name": "page", "in": "query", "schema": { "type": "number", "default": 1 } },
            { "name": "limit", "in": "query", "schema": { "type": "number", "default": 12 } }
          ],
          "responses": {
            "200": { "description": "List of products retrieved successfully" }
          }
        }
      },
      "/api/products/{id}": {
        "get": {
          "tags": ["Products"],
          "summary": "Get details of a single product",
          "parameters": [
            { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
          ],
          "responses": {
            "200": { "description": "Product details with reviews" },
            "404": { "description": "Product not found" }
          }
        }
      },
      "/api/products/{id}/review": {
        "post": {
          "tags": ["Products"],
          "summary": "Submit or update review for a product",
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["rating", "comment"],
                  "properties": {
                    "rating": { "type": "number", "minimum": 1, "maximum": 5, "example": 5 },
                    "comment": { "type": "string", "example": "Amazing beard oil, keeps beard soft!" }
                  }
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Review added/updated successfully" },
            "404": { "description": "Product not found" }
          }
        }
      },
      "/api/cart": {
        "get": {
          "tags": ["Cart"],
          "summary": "Fetch logged-in user's cart",
          "security": [{ "bearerAuth": [] }],
          "responses": {
            "200": { "description": "Cart list" }
          }
        },
        "post": {
          "tags": ["Cart"],
          "summary": "Sync/update user's cart",
          "security": [{ "bearerAuth": [] }],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["items"],
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "product": { "type": "string", "description": "Product ID" },
                          "quantity": { "type": "number", "default": 1 }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "200": { "description": "Cart synchronized successfully" }
          }
        }
      },
      "/api/orders": {
        "post": {
          "tags": ["Orders"],
          "summary": "Place a new order (Checkout)",
          "security": [{ "bearerAuth": [] }],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "required": ["orderItems", "shippingAddress", "paymentInfo", "itemsPrice", "taxPrice", "shippingPrice", "totalPrice"],
                  "properties": {
                    "orderItems": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "name": { "type": "string" },
                          "quantity": { "type": "number" },
                          "image": { "type": "string" },
                          "price": { "type": "number" },
                          "product": { "type": "string", "description": "Product ID" }
                        }
                      }
                    },
                    "shippingAddress": {
                      "type": "object",
                      "properties": {
                        "street": { "type": "string" },
                        "city": { "type": "string" },
                        "state": { "type": "string" },
                        "postalCode": { "type": "string" },
                        "country": { "type": "string" },
                        "phone": { "type": "string" }
                      }
                    },
                    "paymentInfo": {
                      "type": "object",
                      "properties": {
                        "id": { "type": "string" },
                        "status": { "type": "string", "enum": ["pending", "completed", "failed"] }
                      }
                    },
                    "itemsPrice": { "type": "number" },
                    "taxPrice": { "type": "number" },
                    "shippingPrice": { "type": "number" },
                    "totalPrice": { "type": "number" }
                  }
                }
              }
            }
          },
          "responses": {
            "201": { "description": "Order created successfully" },
            "400": { "description": "Insufficient stock or bad request" }
          }
        }
      },
      "/api/orders/myorders": {
        "get": {
          "tags": ["Orders"],
          "summary": "Fetch order history for the logged-in user",
          "security": [{ "bearerAuth": [] }],
          "responses": {
            "200": { "description": "List of user orders" }
          }
        }
      },
      "/api/orders/{id}": {
        "get": {
          "tags": ["Orders"],
          "summary": "Get specific order details by ID",
          "security": [{ "bearerAuth": [] }],
          "parameters": [
            { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
          ],
          "responses": {
            "200": { "description": "Order details retrieved" },
            "403": { "description": "Forbidden to view another user's order" },
            "404": { "description": "Order not found" }
          }
        }
      }
    }
  },
  apis: []
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
