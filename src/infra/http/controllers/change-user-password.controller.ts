import { ChangeUserPasswordUseCase } from '@/domain/delivery/application/use-cases/change-user-password'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { WrongCredentialsError } from '@/domain/delivery/application/use-cases/errors/wrong-credentials-error'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { UserPresenter } from '../presenters/user-presenter'

const changeUserPasswordBodySchema = z.object({
  actualPassword: z.string(),
  newPassword: z.string(),
})

type ChangeUserPasswordBodySchema = z.infer<typeof changeUserPasswordBodySchema>

const bodyValidationPipe = new ZodValidationPipe(changeUserPasswordBodySchema)

@Controller('/users/:userId/change-password')
@UseGuards(new AdminRoleGuard())
export class ChangeUserPasswordController {
  constructor(private changeUserPassword: ChangeUserPasswordUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeUserPasswordBodySchema,
    @Param('userId') userId: string,
  ) {
    const { actualPassword, newPassword } = body

    const result = await this.changeUserPassword.execute({
      userId,
      actualPassword,
      newPassword,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        case UserNotExistsError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      user: UserPresenter.present(result.value.user),
    }
  }
}
