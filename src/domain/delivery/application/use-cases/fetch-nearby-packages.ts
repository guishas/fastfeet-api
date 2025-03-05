import { Either, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { Injectable } from '@nestjs/common'

interface FetchNearbyPackagesUseCaseRequest {
  latitude: number
  longitude: number
  page: number
}

interface FetchNearbyPackagesResponseRight {
  deliveries: Delivery[]
}

type FetchNearbyPackagesUseCaseResponse = Either<
  null,
  FetchNearbyPackagesResponseRight
>

@Injectable()
export class FetchNearbyPackagesUseCase {
  constructor(private deliveriesRepository: DeliveriesRepository) {}

  async execute({
    latitude,
    longitude,
    page,
  }: FetchNearbyPackagesUseCaseRequest): Promise<FetchNearbyPackagesUseCaseResponse> {
    const deliveries = await this.deliveriesRepository.fetchManyNearby(
      latitude,
      longitude,
      { page },
    )

    return right({
      deliveries,
    })
  }
}
