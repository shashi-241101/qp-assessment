import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import {xss} from 'express-xss-sanitizer';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { AppError } from '@/utils/error'
import { config } from '@/config';
import { logger } from '@/utils/logger';
import {errorHandler} from '@/middlewares/error.middleware';
import {router} from '@/routes';

export const createApp = (): Application => {
    const app = express();
    app.use(cors({
        origin: [config.clientUrls],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        preflightContinue: true,
        credentials: true,
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));

    app.use(xss());
    app.use(helmet());
    app.use(cookieParser());
    app.use(session({
        secret: config.jwtSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure:false,        }
    }));

    // Error handling middleware
    app.use(errorHandler);

    app.use('/', router);
    

    app.use('*',(req: Request, _res: Response, next:NextFunction) => {
        logger.error(`Not Found - ${req.originalUrl} - ${req.ip}`);
        next(new AppError(`Cannot find route ${req.originalUrl} on ${config.serviceName}`, 404));
    });

    return app;
}