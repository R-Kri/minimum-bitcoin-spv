
export function bitsToTarget(bits: number): bigint {
    const exponent = bits >>> 24;
    const coefficient = bits & 0xffffff;

    // Bitcoin compact target: coefficient * 2^(8*(exponent-3))
    const exponentAdjustment = BigInt(exponent) - BigInt(3);
    const multiplier = BigInt(2) ** (BigInt(8) * exponentAdjustment);
    
    return BigInt(coefficient) * multiplier;
}

export function hashToBigInt(hash: Buffer): bigint {
    return BigInt("0x" + hash.toString("hex"));
}
