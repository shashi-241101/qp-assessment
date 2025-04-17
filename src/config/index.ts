import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8001,
    jwtSecret: process.env.JWT_SECRET,
    serviceName: process.env.SERVICE_NAME,
    clientUrls: process.env.CLIENT_URL,
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '5432',
    dbName: process.env.DB_NAME || 'grocery_db',
    dbUser: process.env.DB_USER || 'postgres',
    dbPassword: process.env.DB_PASSWORD || 'postgres',
    nodeEnv: process.env.NODE_ENV || 'development',
} as const;