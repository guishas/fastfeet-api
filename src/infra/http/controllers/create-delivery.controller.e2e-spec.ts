import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliveryFactory } from 'test/factories/make-delivery'
import { UserFactory } from 'test/factories/make-user'

describe('Create Delivery (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let deliveryFactory: DeliveryFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, DeliveryFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    deliveryFactory = moduleRef.get(DeliveryFactory)
    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /deliveries', async () => {
    const user = await userFactory.makePrismaAdminUser()

    const accessToken = jwt.sign({ sub: user.id.toValue(), role: 'ADMIN' })

    const delivery = await deliveryFactory.makePrismaDelivery()

    const response = await request(app.getHttpServer())
      .post('/deliveries')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipient: delivery.recipient,
        location: {
          address: delivery.location.address,
          neighborhood: delivery.location.neighborhood,
          city: delivery.location.city,
          latitude: delivery.location.latitude,
          longitude: delivery.location.longitude,
        },
      })

    expect(response.statusCode).toBe(201)

    const deliveryOnDatabase = await prisma.delivery.findUnique({
      where: {
        id: delivery.id.toValue(),
      },
    })

    expect(deliveryOnDatabase).toBeTruthy()
  })
})
