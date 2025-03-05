import { AppModule } from '@/infra/app.module'
import { BcryptHasher } from '@/infra/crypto/bcrypt-hasher'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Change User Password (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let bcrypt: BcryptHasher

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, UserFactory, BcryptHasher],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    bcrypt = moduleRef.get(BcryptHasher)

    await app.init()
  })

  test('[POST] /users/:userId/change-password', async () => {
    await userFactory.makePrismaAdminUser({
      document: '1234567890',
      password: await bcrypt.hash('123456'),
    })

    const delivererUser = await userFactory.makePrismaDelivererUser({
      password: await bcrypt.hash('123456'),
    })

    const authenticateResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        document: '1234567890',
        password: '123456',
      })

    const { access_token: accessToken } = authenticateResponse.body

    const userId = delivererUser.id.toValue()
    const response = await request(app.getHttpServer())
      .post(`/users/${userId}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        actualPassword: '123456',
        newPassword: '12345678',
      })

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    })

    const isPasswordUpdated = await bcrypt.compare(
      '12345678',
      user?.password ?? '',
    )

    expect(response.statusCode).toBe(204)
    expect(isPasswordUpdated).toBeTruthy()
  })

  test('[POST] /users/:userId/change-password (not admin)', async () => {
    const delivererUser = await userFactory.makePrismaDelivererUser({
      document: '0123456789',
      password: await bcrypt.hash('123456'),
    })

    const authenticateResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({
        document: '0123456789',
        password: '123456',
      })

    const { access_token: accessToken } = authenticateResponse.body

    const userId = delivererUser.id.toValue()
    const response = await request(app.getHttpServer())
      .post(`/users/${userId}/change-password`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        actualPassword: '123456',
        newPassword: '12345678',
      })

    expect(response.statusCode).toBe(403)
  })
})
