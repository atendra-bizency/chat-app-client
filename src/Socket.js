import SocketIO from 'socket.io-client';
const BASE_URL = process.env.REACT_APP_API_SOCKET_URL;

const SOCKET_URL = BASE_URL;

let socket = SocketIO(SOCKET_URL, {
    transports: ['websocket'],
    reconnection: true,        // Default is true
    reconnectionAttempts: 5,   // Number of attempts before giving up
    reconnectionDelay: 1000,   // Time between reconnection attempts
});

socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log('Socket disconnected. Reason:', reason);
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    //console.error('Connection error:', error);
});


export default socket;