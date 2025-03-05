import { DeleteUserUseCase } from '@/domain/delivery/application/use-cases/delete-user'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'

@Controller('/users/:userId')
@UseGuards(new AdminRoleGuard())
export class DeleteUserController {
  constructor(private deleteUser: DeleteUserUseCase) {}

  @Delete()
  @HttpCode(200)
  async handle(@Param('userId') userId: string) {
    const result = await this.deleteUser.execute({
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

    return {}
  }
}
