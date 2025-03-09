import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { CommonModule } from '@common';

@Module({
  imports: [NotificationModule, CommonModule.forRootAsync()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
