import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { DeliveryStatusChangedEvent } from '@/domain/delivery/enterprise/events/delivery-status-changed-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnDeliveryStatusChanged implements EventHandler {
  constructor(private sendNotificationUseCase: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendDeliveryStatusChangedNotification.bind(this),
      DeliveryStatusChangedEvent.name,
    )
  }

  private async sendDeliveryStatusChangedNotification({
    delivery,
    status,
  }: DeliveryStatusChangedEvent) {
    await this.sendNotificationUseCase.execute({
      recipientId: delivery.recipient,
      title: 'Temos uma novidade para você',
      content: `O status da sua entrega foi alterado para ${status}!`,
    })
  }
}
