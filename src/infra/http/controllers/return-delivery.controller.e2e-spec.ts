import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { UserFactory } from 'test/factories/make-user'

describe('Return Delivery (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let deliveryFactory: DeliveryFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeliveryFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /return/deliveries/:deliveryId', async () => {
    const user = await userFactory.makePrismaAdminUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'ADMIN' })

    const delivery = await deliveryFactory.makePrismaDelivery()

    const deliveryId = delivery.id.toValue()
    const response = await request(app.getHttpServer())
      .patch(`/return/deliveries/${deliveryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(201)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    expect(deliveryOnDatabase).toMatchObject({
      returnedAt: expect.any(Date),
    })
  })
})
