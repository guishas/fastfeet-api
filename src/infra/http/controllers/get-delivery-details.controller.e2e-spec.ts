import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { UserFactory } from 'test/factories/make-user'

describe('Get Delivery Details (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let deliveryFactory: DeliveryFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /deliveries/:deliveryId', async () => {
    const user = await userFactory.makePrismaAdminUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'ADMIN' })

    const delivery = await deliveryFactory.makePrismaDelivery()

    const deliveryId = delivery.id.toValue()
    const response = await request(app.getHttpServer())
      .get(`/deliveries/${deliveryId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.delivery).toMatchObject({
      id: delivery.id.toValue(),
      recipient: delivery.recipient,
      location: delivery.location,
      status: delivery.status,
    })
  })
})
