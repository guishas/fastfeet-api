import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  DeliveryAttachment,
  DeliveryAttachmentProps,
} from '@/domain/delivery/enterprise/entities/delivery-attachment'

export function makeDeliveryAttachment(
  override: Partial<DeliveryAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const deliveryAttachment = DeliveryAttachment.create(
    {
      attachmentId: new UniqueEntityID(),
      deliveryId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return deliveryAttachment
}
