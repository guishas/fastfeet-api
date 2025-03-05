import { Comparer } from '@/domain/delivery/application/crypto/comparer'
import { Hasher } from '@/domain/delivery/application/crypto/hasher'

export class FakeHasher implements Hasher, Comparer {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return plain.concat('-hashed') === hash
  }
}
