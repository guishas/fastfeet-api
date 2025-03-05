import { DeleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/delete-delivery'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'

@Controller('/deliveries/:deliveryId')
@UseGuards(new AdminRoleGuard())
export class DeleteDeliveryController {
  constructor(private deleteDelivery: DeleteDeliveryUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(@Param('deliveryId') deliveryId: string) {
    const result = await this.deleteDelivery.execute({
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
