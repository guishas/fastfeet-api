import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { UserFactory } from 'test/factories/make-user'

describe('Deliver Delivery (E2E)', () => {
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

  test('[PATCH] /deliver/deliveries/:deliveryId', async () => {
    const user = await userFactory.makePrismaDelivererUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'DELIVERER' })

    const delivery = await deliveryFactory.makePrismaDelivery({
      delivererId: user.id,
    })

    const attachmentResponse = await request(app.getHttpServer())
      .post('/attachments')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.jpg')

    const { attachmentId } = attachmentResponse.body

    const deliveryId = delivery.id.toValue()
    const response = await request(app.getHttpServer())
      .patch(`/deliver/deliveries/${deliveryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId,
      })

    expect(response.statusCode).toBe(201)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: deliveryId,
      },
    })

    expect(deliveryOnDatabase).toMatchObject({
      deliveredAt: expect.any(Date),
    })
  })
})
