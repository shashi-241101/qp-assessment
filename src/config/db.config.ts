import { Sequelize } from 'sequelize';
import {config} from '@/config';
import {logger} from '@/utils/logger';
  
  const sequelize = new Sequelize({
    dialect: 'postgres',
    host: config.dbHost,
    port: parseInt(config.dbPort, 10),
    database: config.dbName,
    username: config.dbUser,
    password: config.dbPassword,
    logging: false,
    // logging: (msg) => logger.debug(msg),
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
  
  export const initializeDatabase = async (): Promise<void> => {
    try {
      await sequelize.authenticate();
      logger.info('Database connection has been established successfully.');
      
      // Sync models with database
      await sequelize.sync({ alter: config.nodeEnv === 'development' });
      logger.info('Database models synchronized.');
    } catch (error) {
      logger.error('Unable to connect to the database:', error);
      throw error;
    }
  };
  
  export default sequelize;