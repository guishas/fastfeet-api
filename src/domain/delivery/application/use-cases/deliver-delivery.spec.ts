import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryDeliveriesRepository } from 'test/repositories/in-memory-deliveries-repository'
import { InMemoryDeliveryAttachmentsRepository } from 'test/repositories/in-memory-delivery-attachments-repository'
import { makeDelivery } from 'test/factories/make-delivery'
import { DeliveryNotExistsError } from './errors/delivery-not-exists-error'
import { DeliveryStatus } from '../../enterprise/entities/delivery'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeDelivererUser } from 'test/factories/make-user'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { DeliverDeliveryUseCase } from './deliver-delivery'
import { NotAuthorizedError } from '../../../../core/errors/not-authorized-error'
import { makeAttachment } from 'test/factories/make-attachment'
import { AttachmentNotExistsError } from './errors/attachment-not-exists-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryDeliveryAttachmentsRepository: InMemoryDeliveryAttachmentsRepository
let inMemoryDeliveriesRepository: InMemoryDeliveriesRepository
let sut: DeliverDeliveryUseCase

describe('Deliver Delivery', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
    inMemoryDeliveryAttachmentsRepository =
      new InMemoryDeliveryAttachmentsRepository()

    inMemoryDeliveriesRepository = new InMemoryDeliveriesRepository(
      inMemoryDeliveryAttachmentsRepository,
      inMemoryAttachmentsRepository,
    )

    sut = new DeliverDeliveryUseCase(
      inMemoryUsersRepository,
      inMemoryDeliveriesRepository,
      inMemoryAttachmentsRepository,
    )
  })

  it('should be able to deliver a delivery', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const attachment = makeAttachment()

    inMemoryAttachmentsRepository.items.push(attachment)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: user.id.toValue(),
      attachmentId: attachment.id.toValue(),
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryDeliveriesRepository.items[0]).toEqual(
      expect.objectContaining({
        delivererId: user.id,
        deliveredAt: expect.any(Date),
        status: DeliveryStatus.DELIVERED,
        attachment: expect.objectContaining({
          attachmentId: attachment.id,
        }),
      }),
    )
  })

  it('should not be able to deliver a delivery that does not exists', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const attachment = makeAttachment()

    inMemoryAttachmentsRepository.items.push(attachment)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: 'delivery-1',
      delivererId: user.id.toValue(),
      attachmentId: attachment.id.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(DeliveryNotExistsError)
  })

  it('should not be able to deliver a delivery with a user that does not exists', async () => {
    const attachment = makeAttachment()

    inMemoryAttachmentsRepository.items.push(attachment)

    const delivery = makeDelivery()

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: 'user-1',
      attachmentId: attachment.id.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(UserNotExistsError)
  })

  it('should not be able to deliver a delivery with a user that did not retrieved the delivery', async () => {
    const user = makeDelivererUser()
    const user2 = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)
    inMemoryUsersRepository.items.push(user2)

    const attachment = makeAttachment()

    inMemoryAttachmentsRepository.items.push(attachment)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: user2.id.toValue(),
      attachmentId: attachment.id.toValue(),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(NotAuthorizedError)
  })

  it('should not be able to deliver a delivery without an attachment', async () => {
    const user = makeDelivererUser()

    inMemoryUsersRepository.items.push(user)

    const delivery = makeDelivery({
      delivererId: user.id,
    })

    inMemoryDeliveriesRepository.items.push(delivery)

    const result = await sut.execute({
      deliveryId: delivery.id.toValue(),
      delivererId: user.id.toValue(),
      attachmentId: 'attachment-1',
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(AttachmentNotExistsError)
  })
})
