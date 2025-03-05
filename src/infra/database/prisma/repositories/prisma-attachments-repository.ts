import { AttachmentsRepository } from '@/domain/delivery/application/repositories/attachments-repository'
import { Attachment } from '@/domain/delivery/enterprise/entities/attachment'
import { PrismaService } from '../prisma.service'
import { PrismaAttachmentsMapper } from '../mappers/prisma-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(attachmentId: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    })

    if (!attachment) {
      return null
    }

    return PrismaAttachmentsMapper.toDomain(attachment)
  }

  async create(attachment: Attachment) {
    const data = PrismaAttachmentsMapper.toPrisma(attachment)

    await this.prisma.attachment.create({
      data,
    })
  }
}
