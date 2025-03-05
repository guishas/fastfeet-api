import { EditDeliveryUseCase } from '@/domain/delivery/application/use-cases/edit-delivery'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveryStatus } from '@/domain/delivery/enterprise/entities/delivery'
import { AdminCannotDeliverError } from '@/domain/delivery/application/use-cases/errors/admin-cannot-deliver-error'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'
import { DeliveryPresenter } from '../presenters/delivery-presenter'

const editDeliveryBodySchema = z.object({
  delivererId: z.string().optional().nullable(),
  recipient: z.string(),
  location: z.object({
    address: z.string(),
    neighborhood: z.string(),
    city: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  status: z.nativeEnum(DeliveryStatus),
})

type EditDeliveryBodySchema = z.infer<typeof editDeliveryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editDeliveryBodySchema)

@Controller('/deliveries/:deliveryId')
@UseGuards(new AdminRoleGuard())
export class EditDeliveryController {
  constructor(private editDelivery: EditDeliveryUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliveryBodySchema,
    @Param('deliveryId') deliveryId: string,
  ) {
    const { delivererId, recipient, location, status } = body

    const result = await this.editDelivery.execute({
      deliveryId,
      delivererId,
      recipient,
      location,
      status,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotExistsError:
          throw new BadRequestException(error.message)
        case AdminCannotDeliverError:
          throw new BadRequestException(error.message)
        case DeliveryNotExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { delivery } = result.value

    return {
      delivery: DeliveryPresenter.present(delivery),
    }
  }
}
