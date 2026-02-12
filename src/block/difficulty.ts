
export function bitsToTarget(bits: number): bigint {
    const exponent = bits >>> 24;
    const coefficient = bits & 0xffffff;

    const target =
        BigInt(coefficient) *
        (BigInt(2) ** (BigInt(8) * (BigInt(exponent) - BigInt(3))));

    return target;
}

export function hashToBigInt(hash: Buffer): bigint {
    return BigInt("0x" + hash.toString("hex"));
}
