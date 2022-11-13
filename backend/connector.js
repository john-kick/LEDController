import * as net from 'node:net';

const HOST = '192.168.178.98';
const PORT = 5000;

export function sendMsg(msg) {
    console.log('Sending command "' + msg + '"');
    const socket = net.createConnection(PORT, HOST);
    socket.write(msg + '\n\r\n');
}