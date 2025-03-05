import { Comparer } from '@/domain/delivery/application/crypto/comparer'
import { Hasher } from '@/domain/delivery/application/crypto/hasher'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements Hasher, Comparer {
  private hashSaltLength = 8

  async hash(plain: string) {
    return await hash(plain, this.hashSaltLength)
  }

  async compare(plain: string, hash: string) {
    return compare(plain, hash)
  }
}
