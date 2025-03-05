import { Uploader } from '@/domain/delivery/application/storage/uploader'
import { Module, Provider } from '@nestjs/common'
import { R2Storage } from './r2-storage'
import { EnvModule } from '../env/env.module'

const R2StorageProvider: Provider = {
  provide: Uploader,
  useClass: R2Storage,
}

@Module({
  imports: [EnvModule],
  providers: [R2StorageProvider],
  exports: [Uploader],
})
export class StorageModule {}
