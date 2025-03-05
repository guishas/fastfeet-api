import { Either, left, right } from '@/core/either'
import { Delivery } from '../../enterprise/entities/delivery'
import { DeliveriesRepository } from '../repositories/deliveries-repository'
import { UserNotExistsError } from './errors/user-not-exists-error'
import { UsersRepository } from '../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface FetchUserDeliveriesUseCaseRequest {
  delivererId: string
  page: number
}

interface FetchUserDeliveriesResponseRight {
  deliveries: Delivery[]
}

type FetchUserDeliveriesUseCaseResponse = Either<
  UserNotExistsError,
  FetchUserDeliveriesResponseRight
>

@Injectable()
export class FetchUserDeliveriesUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private deliveriesRepository: DeliveriesRepository,
  ) {}

  async execute({
    delivererId,
    page,
  }: FetchUserDeliveriesUseCaseRequest): Promise<FetchUserDeliveriesUseCaseResponse> {
    const user = await this.usersRepository.findById(delivererId)

    if (!user) {
      return left(new UserNotExistsError(delivererId))
    }

    const deliveries = await this.deliveriesRepository.fetchManyByDelivererId(
      delivererId,
      { page },
    )

    return right({
      deliveries,
    })
  }
}
