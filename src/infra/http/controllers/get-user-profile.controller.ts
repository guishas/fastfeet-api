import { GetUserProfileUseCase } from '@/domain/delivery/application/use-cases/get-user-profile'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'
import { UserPresenter } from '../presenters/user-presenter'

@Controller('/users/:userId')
@UseGuards(new AdminRoleGuard())
export class GetUserProfileController {
  constructor(private getUserProfile: GetUserProfileUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('userId') userId: string) {
    const result = await this.getUserProfile.execute({
      userId,
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

    const { user } = result.value

    return {
      user: UserPresenter.present(user),
    }
  }
}
