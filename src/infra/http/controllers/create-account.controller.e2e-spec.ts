import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/users').send({
      name: 'John Doe',
      document: '1234567890',
      password: '123456',
      role: 'ADMIN',
    })

    expect(response.statusCode).toBe(201)

    const user = await prisma.user.findUnique({
      where: {
        document: '1234567890',
      },
    })

    expect(user).toBeTruthy()
  })
})
