import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/create-delivery'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { DeliveryPresenter } from '../presenters/delivery-presenter'
import { AdminRoleGuard } from '../guards/admin-role.guard'

const createDeliveryBodySchema = z.object({
  recipient: z.string(),
  location: z.object({
    address: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
})

type CreateDeliveryBodySchema = z.infer<typeof createDeliveryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(createDeliveryBodySchema)

@Controller('/deliveries')
@UseGuards(new AdminRoleGuard())
export class CreateDeliveryController {
  constructor(private createDelivery: CreateDeliveryUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateDeliveryBodySchema) {
    const { recipient, location } = body

    const result = await this.createDelivery.execute({
      recipient,
      location,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { delivery } = result.value

    return {
      delivery: DeliveryPresenter.present(delivery),
    }
  }
}
