import  { Request, Response, NextFunction } from 'express';
import {logger} from '@/utils/logger';

interface AppError extends Error {
    statusCode:number;
    status:string;
    message:string;
}

function isApiError(error:any): error is AppError{
    return 'statusCode' in error;
}

export const errorHandler =(
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) =>{
    if(isApiError(err)){
        const {statusCode, status, message} = err;
        logger.error(`${status} - ${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        res.status(statusCode).json({status, message});
    }else{
        logger.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
   
}