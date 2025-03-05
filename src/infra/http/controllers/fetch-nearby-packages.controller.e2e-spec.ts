import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch Nearby Packages (E2E)', () => {
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

  test('[GET] /nearby/deliveries', async () => {
    const user = await userFactory.makePrismaDelivererUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'DELIVERER' })

    const delivery = await deliveryFactory.makePrismaDelivery()

    const response = await request(app.getHttpServer())
      .get('/nearby/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: delivery.location.latitude,
        longitude: delivery.location.longitude,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveries).toHaveLength(1)
  })
})
