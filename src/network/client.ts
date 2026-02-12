import net from "net";
import { buildMessage } from "./message";

const HOST = "testnet-seed.bitcoin.jonasschnelli.ch";
const PORT = 18333;

export function startClient() {
    const socket = net.createConnection(PORT, HOST, () => {
        console.log("Connected to testnet node");

        const versionPayload = buildVersionPayload();
        const versionMessage = buildMessage("version", versionPayload);

        socket.write(versionMessage);
        console.log("Sent version message");
    });

    socket.on("data", (data) => {
        let offset = 0;

        while (offset < data.length) {
            const magic = data.slice(offset, offset + 4);
            const commandBuffer = data.slice(offset + 4, offset + 16);
            const length = data.readUInt32LE(offset + 16);
            const checksum = data.slice(offset + 20, offset + 24);
            const payload = data.slice(offset + 24, offset + 24 + length);

            const command = commandBuffer.toString("ascii").replace(/\0+$/, "");

            console.log("Received command:", command);

            
            if (command === "version") {
                console.log("Received version, sending verack");

                const verackMessage = buildMessage("verack", Buffer.alloc(0));
                socket.write(verackMessage);
            }

            offset += 24 + length;
        }
    });


    socket.on("error", (err) => {
        console.error("Error:", err);
    });

    socket.on("close", () => {
        console.log("Connection closed");
    });
}

function buildVersionPayload(): Buffer {
    const buffers: Buffer[] = [];

    // protocol version
    const version = Buffer.alloc(4);
    version.writeInt32LE(70015, 0);
    buffers.push(version);

    // services (8 bytes)
    buffers.push(Buffer.alloc(8));

    // timestamp (8 bytes)
    const timestamp = Buffer.alloc(8);
    timestamp.writeBigInt64LE(BigInt(Math.floor(Date.now() / 1000)), 0);
    buffers.push(timestamp);

    // addr_recv (26 bytes)
    buffers.push(Buffer.alloc(26));

    // addr_from (26 bytes)
    buffers.push(Buffer.alloc(26));

    // nonce (8 bytes)
    const nonce = Buffer.alloc(8);
    nonce.writeBigUInt64LE(BigInt(Math.floor(Math.random() * 100000)), 0);
    buffers.push(nonce);

    // user agent (varstr)
    const userAgent = Buffer.from("/minimal-spv:0.1.0/");
    buffers.push(Buffer.from([userAgent.length]));
    buffers.push(userAgent);

    // start height
    const startHeight = Buffer.alloc(4);
    startHeight.writeInt32LE(0, 0);
    buffers.push(startHeight);

    // relay flag
    buffers.push(Buffer.from([0]));

    return Buffer.concat(buffers);
}
