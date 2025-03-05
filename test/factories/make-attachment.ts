import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  AttachmentProps,
  Attachment,
} from '@/domain/delivery/enterprise/entities/attachment'
import { faker } from '@faker-js/faker'

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.slug(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  )

  return attachment
}

// @Injectable()
// export class AttachmentFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaAttachment(
//     data: Partial<AttachmentProps> = {},
//   ): Promise<Attachment> {
//     const attachment = makeAttachment(data)

//     await this.prisma.attachment.create({
//       data: PrismaAttachmentMapper.toPrisma(attachment),
//     })

//     return attachment
//   }
// }
