import { EditUserUseCase } from '@/domain/delivery/application/use-cases/edit-user'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common'
import { AdminRoleGuard } from '../guards/admin-role.guard'
import { UserNotExistsError } from '@/domain/delivery/application/use-cases/errors/user-not-exists-error'
import { UserPresenter } from '../presenters/user-presenter'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { UserRole } from '@/core/types/user-roles'

const editUserBodySchema = z.object({
  name: z.string(),
  document: z.string(),
  role: z.nativeEnum(UserRole),
})

type EditUserBodySchema = z.infer<typeof editUserBodySchema>

const bodyValidationPipe = new ZodValidationPipe(editUserBodySchema)

@Controller('/users/:userId')
@UseGuards(new AdminRoleGuard())
export class EditUserController {
  constructor(private editUser: EditUserUseCase) {}

  @Put()
  @HttpCode(200)
  async handle(
    @Body(bodyValidationPipe) body: EditUserBodySchema,
    @Param('userId') userId: string,
  ) {
    const { name, document, role } = body

    const result = await this.editUser.execute({
      userId,
      name,
      document,
      role,
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
