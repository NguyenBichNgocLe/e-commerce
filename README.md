# Morca 2.0
## Overview
A robust and scalable e-commerce backend API built with NestJS and TypeORM, designed to handle user authentication, product management, and cart functionalities. This project is a foundation for building a full-featured online store, with plans to incorporate order management, diverse payment methods, reviews, wishlists, and more.

## Features
- Authentication & Authorization: Secure user routes with JWT and role-based access control.
- User Management: Includes getting the user profile, updating the user's information, and removing a user.
- Product Management: Includes creating a product, getting a product's information, getting product(s) based on filtering choices, getting all products in the system, updating a product's information, and removing a product.
- Cart Management: Includes getting the cart, adding items to the cart, removing an item from the cart, and emptying the entire cart.

## Prerequisites
- Node.js: Ensure you have Node.js installed on your machine. You can download it from [here](https://nodejs.org/en).
- Docker: Docker is required to run the database in a container. You can install Docker from [here](https://www.docker.com/).
- [DBeaver](https://dbeaver.io/): Optional but recommended to visually interact with the MySQL database.
- [Postman](https://www.postman.com/): Used to test API endpoints.

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up the environment variables:
```
jwt_secret=your_jwt_secret
jwt_refresh_secret=your_jwt_refresh_secret
```
4. Set up the database: Start the MySQL database using Docker. A helper script is available at `scripts/start-db.sh`.
5. Verify database is running: Check if the MySQL database is running, use the following command `sudo docker ps`. Ensure that you see a container named `mysql` in the output.
6. To run the project: `npm run start` or `npm run start:dev` or consult the NestJS documents for more ways to run the project.
7. Interact with the Database: Use [DBeaver](https://dbeaver.io/) to connect to the MySQL database for an easier way to manage and inspect your data.
8. Test API Endpoints: Use [Postman](https://www.postman.com/) to interact with the API.

## API Documentation
### Auth Module
Handles authentication and authorization logic, including user registration, user login, and JWT token generation.
- POST /auth/login: User login.
- POST /auth/register: User registration.
- POST /auth/refresh: Get a new JWT access token and a new refresh token when the previous access token expires.
- POST /auth/signout: User signout.

### User Module
Manages user-related operations with RBAC.
- GET /users/all: Get all users' profiles.
- GET /users/profile: Get the current logged-in user's profile.
- PATCH /users: Update the current logged-in user information.
- DELETE /users/:id : Delete a user using the user ID number.

### Product Module
Manages products with full CRUD capabilities and filtering options.
- POST /products: Create the product.
- GET /products/all: Get all products.
- GET /products/single/:id : Get a product using its ID number.
- GET /products/filteredProduct: Get products based on search keyword or/and category.
- PATCH /products/:id : Update a product's information.
- DELETE /products/:id : Remove a product.

### Cart Module
Handles shopping cart functionalities.
- GET /cart/myCart: Retrieve the currently logged-in user's cart.
- GET /cart/all: Retrieve all carts in the system.
- POST /cart/addItem: Add an item to the current user's cart using the product ID.
- DELETE /cart/item/:productId : Remove an item from the current user's cart using the product ID.
- DELETE /cart/emptyCart: Empty the current user's cart.

## Planned Features
- Order Management: Handling user orders, order statuses, and order history.
- Payment Integration: Supporting various payment methods beyond cash.
- Product Reviews: Allowing users to leave reviews and ratings for products.
- Wishlist Functionality: Enabling users to save products for future purchases.
- Enhanced Search & Filtering: Implementing advanced search algorithms and filters.
