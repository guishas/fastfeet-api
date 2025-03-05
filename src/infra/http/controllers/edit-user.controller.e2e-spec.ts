import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Edit User (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /users/:userId', async () => {
    const user = await userFactory.makePrismaAdminUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'ADMIN' })

    const delivererUser = await userFactory.makePrismaDelivererUser({
      name: 'John Doe',
      document: '1234567890',
    })

    const userId = user.id.toValue()
    const response = await request(app.getHttpServer())
      .put(`/users/${userId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Guigo',
        document: '0123456789',
        role: delivererUser.role,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      user: expect.objectContaining({
        name: 'Guigo',
        document: '0123456789',
      }),
    })
  })
})
