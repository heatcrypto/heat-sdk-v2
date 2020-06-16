import { createHash, Hash, BinaryLike } from 'crypto'

let SHA256_hash: Hash;

export function SHA256_init() {
  SHA256_hash = createHash('SHA256');
}

export function SHA256_write(msg:Array<number>) {
  SHA256_hash.update(Buffer.from(msg))
}

export function SHA256_finalize() {
  return Array.from(SHA256_hash.digest())
}