import winston from 'winston';
import {config}from '@/config';

export const logger = winston.createLogger({
    level: config.env === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
                ),
            ),
        }),
    ]
});