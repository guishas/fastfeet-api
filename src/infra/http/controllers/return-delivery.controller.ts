import { ReturnDeliveryUseCase } from '@/domain/delivery/application/use-cases/return-delivery'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'
import { AdminRoleGuard } from '../guards/admin-role.guard'

@Controller('/return/deliveries/:deliveryId')
@UseGuards(new AdminRoleGuard())
export class ReturnDeliveryController {
  constructor(private returnDelivery: ReturnDeliveryUseCase) {}

  @Patch()
  @HttpCode(201)
  async handle(@Param('deliveryId') deliveryId: string) {
    const result = await this.returnDelivery.execute({
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
