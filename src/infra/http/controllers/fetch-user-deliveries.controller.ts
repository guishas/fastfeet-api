import { FetchUserDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-user-deliveries'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { DeliveryPresenter } from '../presenters/delivery-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TokenSchema } from '@/infra/auth/jwt.strategy'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/fetch/users/deliveries')
export class FetchUserDeliveriesController {
  constructor(private fetchUserDeliveries: FetchUserDeliveriesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @CurrentUser() user: TokenSchema,
  ) {
    const userId = user.sub

    const result = await this.fetchUserDeliveries.execute({
      delivererId: userId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { deliveries } = result.value

    return {
      deliveries: deliveries.map(DeliveryPresenter.present),
    }
  }
}
