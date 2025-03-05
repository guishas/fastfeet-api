import { DeliverDeliveryUseCase } from '@/domain/delivery/application/use-cases/deliver-delivery'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { DeliveryNotExistsError } from '@/domain/delivery/application/use-cases/errors/delivery-not-exists-error'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deliverDeliveryBodySchema = z.object({
  attachmentId: z.string(),
})

type DeliverDeliveryBodySchema = z.infer<typeof deliverDeliveryBodySchema>

const bodyValidationPipe = new ZodValidationPipe(deliverDeliveryBodySchema)

@Controller('/deliver/deliveries/:deliveryId')
export class DeliverDeliveryController {
  constructor(private deliverDelivery: DeliverDeliveryUseCase) {}

  @Patch()
  @HttpCode(201)
  async handle(
    @Param('deliveryId') deliveryId: string,
    @Body(bodyValidationPipe) body: DeliverDeliveryBodySchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const userId = user.sub

    const { attachmentId } = body

    const result = await this.deliverDelivery.execute({
      deliveryId,
      delivererId: userId,
      attachmentId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliveryNotExistsError:
          throw new BadRequestException(error.message)
        case UserNotExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {}
  }
}
