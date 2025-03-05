import { Module } from '@nestjs/common'
import { CryptoModule } from '../crypto/crypto.module'
import { CreateAccountController } from './controllers/create-account.controller'
import { RegisterUserUseCase } from '@/domain/delivery/application/use-cases/register-user'
import { DatabaseModule } from '../database/database.module'
import { AuthenticateUserController } from './controllers/authenticate-user.controller'
import { AuthenticateUserUseCase } from '@/domain/delivery/application/use-cases/authenticate-user'
import { ChangeUserPasswordController } from './controllers/change-user-password.controller'
import { ChangeUserPasswordUseCase } from '@/domain/delivery/application/use-cases/change-user-password'
import { GetUserProfileController } from './controllers/get-user-profile.controller'
import { GetUserProfileUseCase } from '@/domain/delivery/application/use-cases/get-user-profile'
import { EditUserController } from './controllers/edit-user.controller'
import { EditUserUseCase } from '@/domain/delivery/application/use-cases/edit-user'
import { DeleteUserController } from './controllers/delete-user.controller'
import { DeleteUserUseCase } from '@/domain/delivery/application/use-cases/delete-user'
import { StorageModule } from '../storage/storage.module'
import { UploadAttachmentController } from './controllers/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/delivery/application/use-cases/upload-and-create-attachment'
import { CreateDeliveryController } from './controllers/create-delivery.controller'
import { CreateDeliveryUseCase } from '@/domain/delivery/application/use-cases/create-delivery'
import { DeleteDeliveryController } from './controllers/delete-delivery.controller'
import { DeleteDeliveryUseCase } from '@/domain/delivery/application/use-cases/delete-delivery'
import { EditDeliveryController } from './controllers/edit-delivery.controller'
import { EditDeliveryUseCase } from '@/domain/delivery/application/use-cases/edit-delivery'
import { GetDeliveryDetailsController } from './controllers/get-delivery-details.controller'
import { GetDeliveryDetailsUseCase } from '@/domain/delivery/application/use-cases/get-delivery-details'
import { FetchNearbyPackagesController } from './controllers/fetch-nearby-packages.controller'
import { FetchNearbyPackagesUseCase } from '@/domain/delivery/application/use-cases/fetch-nearby-packages'
import { FetchUserDeliveriesController } from './controllers/fetch-user-deliveries.controller'
import { FetchUserDeliveriesUseCase } from '@/domain/delivery/application/use-cases/fetch-user-deliveries'
import { PrepareDeliveryController } from './controllers/prepare-delivery.controller'
import { PrepareDeliveryUseCase } from '@/domain/delivery/application/use-cases/prepare-delivery'
import { RetrieveDeliveryController } from './controllers/retrieve-delivery.controller'
import { RetrieveDeliveryUseCase } from '@/domain/delivery/application/use-cases/retrieve-delivery'
import { DeliverDeliveryController } from './controllers/deliver-delivery.controller'
import { DeliverDeliveryUseCase } from '@/domain/delivery/application/use-cases/deliver-delivery'
import { ReturnDeliveryController } from './controllers/return-delivery.controller'
import { ReturnDeliveryUseCase } from '@/domain/delivery/application/use-cases/return-delivery'

@Module({
  imports: [DatabaseModule, CryptoModule, StorageModule],
  controllers: [
    CreateAccountController,
    AuthenticateUserController,
    ChangeUserPasswordController,
    GetUserProfileController,
    EditUserController,
    DeleteUserController,
    UploadAttachmentController,
    CreateDeliveryController,
    DeleteDeliveryController,
    EditDeliveryController,
    GetDeliveryDetailsController,
    FetchNearbyPackagesController,
    FetchUserDeliveriesController,
    PrepareDeliveryController,
    RetrieveDeliveryController,
    DeliverDeliveryController,
    ReturnDeliveryController,
  ],
  providers: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    ChangeUserPasswordUseCase,
    GetUserProfileUseCase,
    EditUserUseCase,
    DeleteUserUseCase,
    UploadAndCreateAttachmentUseCase,
    CreateDeliveryUseCase,
    DeleteDeliveryUseCase,
    EditDeliveryUseCase,
    GetDeliveryDetailsUseCase,
    FetchNearbyPackagesUseCase,
    FetchUserDeliveriesUseCase,
    PrepareDeliveryUseCase,
    RetrieveDeliveryUseCase,
    DeliverDeliveryUseCase,
    RetrieveDeliveryUseCase,
    ReturnDeliveryUseCase,
  ],
})
export class HttpModule {}
