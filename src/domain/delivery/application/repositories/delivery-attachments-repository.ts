export abstract class DeliveryAttachmentsRepository {
  abstract deleteByDeliveryId(deliveryId: string): Promise<void>
}
