import { GetDeliveryDetailsUseCase } from '@/domain/delivery/application/use-cases/get-delivery-details'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'
import { DeliveryPresenter } from '../presenters/delivery-presenter'

@Controller('/deliveries/:deliveryId')
@UseGuards(new AdminRoleGuard())
export class GetDeliveryDetailsController {
  constructor(private getDeliveryDetails: GetDeliveryDetailsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('deliveryId') deliveryId: string) {
    const result = await this.getDeliveryDetails.execute({
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

    const { delivery } = result.value

    return {
      delivery: DeliveryPresenter.present(delivery),
    }
  }
}
