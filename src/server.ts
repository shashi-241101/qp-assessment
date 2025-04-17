import { createServer } from 'http';
import { Server } from 'socket.io';
import { config } from '@/config';
import { createApp } from './app';
import { initializeDatabase } from '@/config/db.config';
import {connectSocketServer} from '@/socket'

let ioInstance: Server | null = null;

async function startServer(){

    await initializeDatabase();

    const app = createApp();
    const httpServer = createServer(app);

    httpServer.listen(config.port, ()=>{
        console.log(`Server is running on port url: http://localhost:${config.port}`);
    })

    const io= new Server(httpServer, {
        cors: {
            origin: '*',
        },
        maxHttpBufferSize: 1e8,
    });

    io.on('connection', connectSocketServer(io));

    ioInstance = io;
    return {io, httpServer};
}

startServer();

export const getIO = () => {
    if(!ioInstance){
        throw new Error('Socket.io is not initialized');
    }
    return ioInstance;
}

export default{
    get io(){
        return getIO();
    }
}