import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  public items: Attachment[] = []

  async findById(attachmentId: string) {
    const attachment = this.items.find((item) =>
      item.id.stringEquals(attachmentId),
    )

    if (!attachment) {
      return null
    }

    return attachment
  }

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
