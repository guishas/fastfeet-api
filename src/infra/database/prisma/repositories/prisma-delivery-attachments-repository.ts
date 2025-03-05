import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async deleteByDeliveryId(deliveryId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        deliveryId,
      },
    })
  }
}
