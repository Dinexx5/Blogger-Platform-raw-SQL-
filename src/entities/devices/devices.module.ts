import { Module } from '@nestjs/common';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { DevicesRepository } from './devices.repository';

@Module({
  imports: [],
  providers: [DevicesService, DevicesRepository],
  controllers: [DevicesController],
  exports: [DevicesService, DevicesRepository],
})
export class DevicesModule {}
