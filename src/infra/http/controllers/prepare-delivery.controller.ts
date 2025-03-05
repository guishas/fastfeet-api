import { PrepareDeliveryUseCase } from '@/domain/delivery/application/use-cases/prepare-delivery'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'

@Controller('/deliveries/:deliveryId/prepare')
@UseGuards(new AdminRoleGuard())
export class PrepareDeliveryController {
  constructor(private prepareDelivery: PrepareDeliveryUseCase) {}

  @Patch()
  @HttpCode(201)
  async handle(@Param('deliveryId') deliveryId: string) {
    const result = await this.prepareDelivery.execute({
      deliveryId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryNotExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
