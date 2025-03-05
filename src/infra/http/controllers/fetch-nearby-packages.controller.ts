import { FetchNearbyPackagesUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-packages'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { DeliveryPresenter } from '../presenters/delivery-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const pageQueryParamSchema = z
  .string()
  .optional()
  .default('1')
  .transform(Number)
  .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

const fetchNearbyPackagesBodySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

type FetchNearbyPackagesBodySchema = z.infer<
  typeof fetchNearbyPackagesBodySchema
>

const bodyValidationPipe = new ZodValidationPipe(fetchNearbyPackagesBodySchema)

@Controller('/nearby/deliveries')
export class FetchNearbyPackagesController {
  constructor(private fetchNearbyPackages: FetchNearbyPackagesUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @Query('page', queryValidationPipe) page: PageQueryParamSchema,
    @Body(bodyValidationPipe) body: FetchNearbyPackagesBodySchema,
  ) {
    const { latitude, longitude } = body

    const result = await this.fetchNearbyPackages.execute({
      latitude,
      longitude,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveries } = result.value

    return {
      deliveries: deliveries.map(DeliveryPresenter.present),
    }
  }
}
