import {Server, Socket} from 'socket.io';
import {logger} from '@/utils/logger';


export function connectSocketServer(io:Server){
    return (socket:Socket)=>{
        logger.info(`New connection - ${socket.id}`);

        socket.on('disconnect', ()=>{
            logger.info(`Disconnected - ${socket.id}`);
        });

        socket.on('Hello', ()=>{
            logger.info('Hello from client');
            console.log('Received Hello from client');
        });
    }
}