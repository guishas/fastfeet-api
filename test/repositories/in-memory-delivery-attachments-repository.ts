import { DeliveryAttachmentsRepository } from '@/domain/delivery/application/repositories/delivery-attachments-repository'
import { DeliveryAttachment } from '@/domain/delivery/enterprise/entities/delivery-attachment'

export class InMemoryDeliveryAttachmentsRepository
  implements DeliveryAttachmentsRepository
{
  public items: DeliveryAttachment[] = []

  async create(deliveryAttachment: DeliveryAttachment | undefined | null) {
    if (!deliveryAttachment) {
      throw new Error('Unexpected null object.')
    }

    this.items.push(deliveryAttachment)
  }

  async delete(deliveryAttachment: DeliveryAttachment | undefined | null) {
    if (!deliveryAttachment) {
      throw new Error('Unexpected null object.')
    }

    const itemIndex = this.items.findIndex((item) =>
      item.equals(deliveryAttachment),
    )

    this.items.splice(itemIndex, 1)
  }

  async deleteByDeliveryId(deliveryId: string) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.stringEquals(deliveryId),
    )

    this.items.splice(itemIndex, 1)
  }
}
