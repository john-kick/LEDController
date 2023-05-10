import dgram from "dgram";

const HOST = "192.168.178.98";
const PORT = 8888;

let socket = dgram.createSocket('udp4');

export async function send(strip: Uint8Array) {
	socket.send(strip, PORT, HOST, (err) => {
		if (err) {
			socket.close();
			throw err;
		}
	});
}