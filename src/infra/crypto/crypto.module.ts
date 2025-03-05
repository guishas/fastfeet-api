import { Encrypter } from '@/domain/delivery/application/crypto/encrypter'
import { Module, Provider } from '@nestjs/common'
import { JwtEncrypter } from './jwt-encrypter'
import { Hasher } from '@/domain/delivery/application/crypto/hasher'
import { BcryptHasher } from './bcrypt-hasher'
import { Comparer } from '@/domain/delivery/application/crypto/comparer'

const JwtEncrypterProvider: Provider = {
  provide: Encrypter,
  useClass: JwtEncrypter,
}

const BcryptHasherProvider: Provider = {
  provide: Hasher,
  useClass: BcryptHasher,
}

const BcryptComparerProvider: Provider = {
  provide: Comparer,
  useClass: BcryptHasher,
}

@Module({
  providers: [
    JwtEncrypterProvider,
    BcryptHasherProvider,
    BcryptComparerProvider,
  ],
  exports: [Encrypter, Hasher, Comparer],
})
export class CryptoModule {}
