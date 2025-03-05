import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { UserFactory } from 'test/factories/make-user'

describe('Fetch User Deliveries (E2E)', () => {
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

  test('[GET] fetch/users/deliveries', async () => {
    const user = await userFactory.makePrismaDelivererUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'DELIVERER' })

    await deliveryFactory.makePrismaDelivery({
      delivererId: user.id,
    })
    await deliveryFactory.makePrismaDelivery({
      delivererId: user.id,
    })
    await deliveryFactory.makePrismaDelivery({
      delivererId: user.id,
    })

    const response = await request(app.getHttpServer())
      .get('/fetch/users/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.deliveries).toHaveLength(3)
  })
})
