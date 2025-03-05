import { Encrypter } from '@/domain/delivery/application/crypto/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwt: JwtService) {}

  async encrypt(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload)
  }
}
