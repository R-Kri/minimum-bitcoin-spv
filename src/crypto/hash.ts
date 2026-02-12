import { createHash } from "crypto";

// single sha256
export function sha256(data: Buffer): Buffer {
    return createHash("sha256").update(data).digest();
}

// Perform Bitcoin-style double SHA256
export function doubleSha256(data: Buffer): Buffer {
    return sha256(sha256(data));
}

// Reverse buffer (Bitcoin uses little-endian internally)
export function reverseBuffer(buf: Buffer): Buffer {
    return Buffer.from(buf).reverse();
}
