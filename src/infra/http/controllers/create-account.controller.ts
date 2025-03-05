import { RegisterUserUseCase } from '@/domain/delivery/application/use-cases/register-user'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { z } from 'zod'
import { UserRole } from '@/core/types/user-roles'
import { UserAlreadyExistsError } from '@/domain/delivery/application/use-cases/errors/user-already-exists-error'
import { UserPresenter } from '../presenters/user-presenter'

const createAccountBodySchema = z.object({
  name: z.string(),
  document: z.string(),
  password: z.string(),
  role: z.string(),
})

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>

@Controller('/users')
@Public()
export class CreateAccountController {
  constructor(private registerUser: RegisterUserUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createAccountBodySchema))
  async handle(@Body() body: CreateAccountBodySchema) {
    const { name, document, password, role } = body

    const result = await this.registerUser.execute({
      name,
      document,
      password,
      role: UserRole[role],
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
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
