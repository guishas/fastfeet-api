import { Module, Provider } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { DeliveriesRepository } from '@/domain/delivery/application/repositories/deliveries-repository'
import { UsersRepository } from '@/domain/delivery/application/repositories/users-repository'
import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { PrismaDeliveriesRepository } from './prisma/repositories/prisma-deliveries-repository'
import { PrismaUsersRepository } from './prisma/repositories/prisma-users-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaDeliveryAttachmentsRepository } from './prisma/repositories/prisma-delivery-attachments-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

const PrismaDeliveriesRepositoryProvider: Provider = {
  provide: DeliveriesRepository,
  useClass: PrismaDeliveriesRepository,
}

const PrismaUsersRepositoryProvider: Provider = {
  provide: UsersRepository,
  useClass: PrismaUsersRepository,
}

const PrismaAttachmentsRepositoryProvider: Provider = {
  provide: AttachmentsRepository,
  useClass: PrismaAttachmentsRepository,
}

const PrismaDeliveryAttachmentsRepositoryProvider: Provider = {
  provide: DeliveryAttachmentsRepository,
  useClass: PrismaDeliveryAttachmentsRepository,
}

const PrismaNotificationsRepositoryProvider: Provider = {
  provide: NotificationsRepository,
  useClass: PrismaNotificationsRepository,
}

@Module({
  imports: [],
  providers: [
    PrismaService,
    PrismaDeliveriesRepositoryProvider,
    PrismaUsersRepositoryProvider,
    PrismaAttachmentsRepositoryProvider,
    PrismaDeliveryAttachmentsRepositoryProvider,
    PrismaNotificationsRepositoryProvider,
  ],
  exports: [
    PrismaService,
    DeliveriesRepository,
    UsersRepository,
    AttachmentsRepository,
    DeliveryAttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
