import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { FirebaseModule } from 'src/config/firebase.config.module';
import { FirebaseService } from 'src/config/firebase.config.service';
import { CommonModule } from '@common';

@Module({
  imports: [FirebaseModule.forRootAsync(), CommonModule.forRootAsync()],
  controllers: [NotificationController],
  providers: [NotificationService, FirebaseService],
})
export class NotificationModule { }
