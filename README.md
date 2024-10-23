# Coupons Management API

This project provides a REST API for managing and applying coupons for an e-commerce platform. It supports cart-wise, product-wise, and Buy X Get Y (BxGy) coupon types. The API allows for easy expansion of new coupon types in the future.

## Table of Contents
1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [API Endpoints](#api-endpoints)
4. [Scopes Not Covered & Proposed Solutions](#scopes-not-covered-and-proposed-solutions)
5. [Testing with Postman](#testing-with-postman)
6. [Error Handling](#error-handling)

---

### 1. Installation

```bash
npm install
npm install -g nodemon
```

### 2. Environment Variables

Create a `.env` file in the root of your project and include the following variables:

```bash
# MongoDB URI
MONGO_URI=mongodb+srv://pr639490:LLxMEWNj1bF0StwQ@cluster0.zzjcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

# Server Port
PORT=5000

# JWT Configurations
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=30d

NODE_ENV=LOCAL

```

### 3. API Endpoints

#### Coupon Management
- **POST /api/coupons**: Create a new coupon.
- **GET /api/coupons**: Retrieve all coupons.
- **GET /api/coupons/:id**: Retrieve a specific coupon by its ID.
- **PUT /api/coupons/:id**: Update an existing coupon.
- **DELETE /api/coupons/:id**: Delete a coupon by its ID.

#### Applying Coupons
- **POST /api/applicable-coupons**: Get applicable coupons for a cart.
- **POST /api/apply-coupon/:id**: Apply a specific coupon to a cart.

---

### 4. Scopes Not Covered & Proposed Solutions

During the development of this API, the following scopes were not fully implemented. These can be implemented as part of future enhancements:

1. **User Authentication & Authorization**:
   - **Problem**: Currently, there is no user authentication or authorization implemented in the system.
   - **Proposed Solution**: Implementing JWT-based authentication to secure the API endpoints. This would involve adding middleware to validate JWT tokens and ensuring only authorized users can create, update, or delete coupons.

2. **Coupon Expiration Notifications**:
   - **Problem**: The system does not notify users when a coupon is about to expire.
   - **Proposed Solution**: Create a background job using tools like `node-cron` to regularly check for coupons nearing expiration and send email notifications to the users or administrators.

3. **Enhanced Coupon Condition Logic**:
   - **Problem**: Currently, the condition logic for product-wise and BxGy coupons is basic.
   - **Proposed Solution**: Expand the conditions for coupons to allow for more complex combinations, such as category-specific discounts, time-based discounts (e.g., only valid on weekends), or user-specific discounts (e.g., first-time customers).

4. **Coupon Usage Limit**:
   - **Problem**: There’s no mechanism to limit the number of times a coupon can be used.
   - **Proposed Solution**: Add a `usageLimit` field to the coupon schema, and track the number of times each coupon is redeemed. Prevent the coupon from being applied once the limit is reached.

5. **Coupon Stacking**:
   - **Problem**: The API does not currently support applying multiple coupons in a single transaction.
   - **Proposed Solution**: Add logic to check whether multiple coupons can be combined and determine the correct order for applying discounts.

6. **Detailed Coupon Reports**:
   - **Problem**: No reporting mechanism exists for analyzing coupon usage.
   - **Proposed Solution**: Implement an endpoint to generate reports on coupon usage, including details like the number of redemptions, total discount given, and the revenue impact.

---

### 5. Testing with Postman

You can test all the endpoints using Postman by setting the following request bodies:

#### Create a Coupon (`POST /api/coupons`)
```json
{
  "type": "cart-wise",
  "discountDetails": {
    "amount": 15,
    "type": "percentage"
  },
  "conditions": {
    "minCartAmount": 100
  },
  "expirationDate": "2025-01-01T00:00:00Z"
}
```

#### Get Applicable Coupons for a Cart (`POST /api/applicable-coupons`)
```json
{
  "cartItems": [
    { "productId": "productId1", "price": 50, "quantity": 2 },
    { "productId": "productId2", "price": 150, "quantity": 1 }
  ]
}
```

#### Apply a Coupon to a Cart (`POST /api/apply-coupon/:id`)
```json
{
  "cartItems": [
    { "productId": "productId1", "price": 50, "quantity": 2 },
    { "productId": "productId2", "price": 150, "quantity": 1 }
  ]
}
```

---

### 6. Error Handling

The API uses global error handling middleware to handle all errors. Errors are returned in the following structure:

```json
{
  "success": false,
  "message": "Error message"
}
```