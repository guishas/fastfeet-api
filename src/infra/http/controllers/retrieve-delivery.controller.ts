import { RetrieveDeliveryUseCase } from '@/domain/delivery/application/use-cases/retrieve-delivery'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'
import { NotAuthorizedError } from '@/core/errors/not-authorized-error'

@Controller('/retrieve/deliveries/:deliveryId')
export class RetrieveDeliveryController {
  constructor(private retrieveDelivery: RetrieveDeliveryUseCase) {}

  @Patch()
  @HttpCode(201)
  async handle(
    @Param('deliveryId') deliveryId: string,
    @CurrentUser() user: TokenSchema,
  ) {
    const userId = user.sub

    const result = await this.retrieveDelivery.execute({
      deliveryId,
      delivererId: userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryNotExistsError:
          throw new BadRequestException(error.message)
        case UserNotExistsError:
          throw new BadRequestException(error.message)
        case NotAuthorizedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
