import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { DeliveryAttachment } from './delivery-attachment'
import { DeliveryStatusChangedEvent } from '../events/delivery-status-changed-event'

export enum DeliveryStatus {
  IDLE = 'IDLE',
  AWAITING = 'AWAITING',
  RETRIEVED = 'RETRIEVED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export interface LocationProps {
  address: string
  neighborhood: string
  city: string
  latitude: number
  longitude: number
}

export interface DeliveryProps {
  delivererId?: UniqueEntityID | null
  recipient: string
  location: LocationProps
  status: DeliveryStatus
  attachment?: DeliveryAttachment | null
  createdAt: Date
  preparedAt?: Date | null
  retrievedAt?: Date | null
  deliveredAt?: Date | null
  returnedAt?: Date | null
  updatedAt?: Date | null
}

export class Delivery extends AggregateRoot<DeliveryProps> {
  get delivererId() {
    return this.props.delivererId
  }

  get recipient() {
    return this.props.recipient
  }

  get location() {
    return this.props.location
  }

  get status() {
    return this.props.status
  }

  get attachment() {
    return this.props.attachment
  }

  get createdAt() {
    return this.props.createdAt
  }

  get preparedAt() {
    return this.props.preparedAt
  }

  get retrievedAt() {
    return this.props.retrievedAt
  }

  get deliveredAt() {
    return this.props.deliveredAt
  }

  get returnedAt() {
    return this.props.returnedAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  set delivererId(delivererId: UniqueEntityID | undefined | null) {
    this.props.delivererId = delivererId

    this.touch()
  }

  set recipient(recipient: string) {
    this.props.recipient = recipient

    this.touch()
  }

  set location(location: LocationProps) {
    this.props.location = location

    this.touch()
  }

  set status(status: DeliveryStatus) {
    this.props.status = status

    this.touch()
  }

  set attachment(attachment: DeliveryAttachment | undefined | null) {
    this.props.attachment = attachment

    this.touch()
  }

  set preparedAt(preparedAt: Date | undefined | null) {
    this.props.preparedAt = preparedAt

    this.addDomainEvent(
      new DeliveryStatusChangedEvent(this, DeliveryStatus.AWAITING),
    )

    this.touch()
  }

  set retrievedAt(retrievedAt: Date | undefined | null) {
    this.props.retrievedAt = retrievedAt

    this.addDomainEvent(
      new DeliveryStatusChangedEvent(this, DeliveryStatus.RETRIEVED),
    )

    this.touch()
  }

  set deliveredAt(deliveredAt: Date | undefined | null) {
    this.props.deliveredAt = deliveredAt

    this.addDomainEvent(
      new DeliveryStatusChangedEvent(this, DeliveryStatus.DELIVERED),
    )

    this.touch()
  }

  set returnedAt(returnedAt: Date | undefined | null) {
    this.props.returnedAt = returnedAt

    this.addDomainEvent(
      new DeliveryStatusChangedEvent(this, DeliveryStatus.RETURNED),
    )

    this.touch()
  }

  static create(
    props: Optional<DeliveryProps, 'createdAt' | 'status' | 'attachment'>,
    id?: UniqueEntityID,
  ) {
    const delivery = new Delivery(
      {
        ...props,
        status: props.status ?? DeliveryStatus.IDLE,
        attachment: props.attachment,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return delivery
  }
}
