import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract findById(attachmentId: string): Promise<Attachment | null>
  abstract create(attachment: Attachment): Promise<void>
}
