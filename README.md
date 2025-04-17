Grocery Booking API

A TypeScript-based RESTful API for managing grocery bookings with admin and user roles. Built with Node.js, Express, Sequelize, and PostgreSQL. Dockerized for easy deployment.

Features

Admin

Add, view, update, and delete grocery items

Manage inventory levels

User

View available grocery items

Book multiple items in a single order

View order history

Tech Stack

TypeScript, Node.js, Express.js

PostgreSQL, Sequelize ORM

JWT Authentication

Docker, Docker Compose

pnpm Package Manager

Setup (Using Docker - Recommended)

Clone the Repository:

git clone https://github.com/shashi-241101/qp-assessment.git

cd qp-assessment

Setup Configurations:

cp .env.example .env
cp docker-compose.yml.example docker-compose.yml

Edit .env and docker-compose.yml to set JWT_SECRET and database credentials. Ensure DB_HOST is set to postgres.

Build and Start Services:

docker-compose build
docker-compose up -d

Access API:
Visit http://localhost:8001

Logs:

docker-compose logs -f app       # API logs
docker-compose logs -f postgres  # Database logs

Stop Services:

docker-compose down

To remove all data: docker-compose down -v

Setup (Without Docker)

Clone the Repository:

git clone https://github.com/shashi-241101/qp-assessment.git

cd qp-assessment

Install Dependencies:

pnpm install

Setup Environment:

cp .env.example .env

Edit .env to set JWT_SECRET and database credentials.

Ensure Database Exists:
Create the database and user as per .env settings.

Build and Run:

pnpm run build
pnpm start

Development Mode:

pnpm run dev

API Endpoints

Authentication

POST /api/auth/register - Register user

POST /api/auth/login - Login and receive token

Admin (Protected)

POST /api/admin/grocery - Add grocery item

GET /api/admin/grocery - View all items

GET /api/admin/grocery/:id - View item by ID

PUT /api/admin/grocery/:id - Update item

DELETE /api/admin/grocery/:id - Delete item

PATCH /api/admin/grocery/:id/inventory - Update inventory

User

GET /api/user/grocery - View available items

POST /api/user/orders - Place order (protected)

GET /api/user/orders - View user's orders (protected)

GET /api/user/orders/:id - View specific order (protected)

Database Schema

Users

id (PK), username, email, password (hashed), role, createdAt, updatedAt

Grocery Items

id (PK), name, description, price, inventory, createdAt, updatedAt

Orders

id (PK), userId (FK), totalAmount, status, createdAt, updatedAt

Order Items

id (PK), orderId (FK), groceryItemId (FK), quantity, price, createdAt, updatedAt

