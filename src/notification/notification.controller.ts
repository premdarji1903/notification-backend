import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SaveNotificationData } from './dto/save-notificationd-request-dto';
import { Role, RoleEnum } from '@common';
import { Response } from 'express';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  // @Role(Rolenum.ADMIN)
  @Post('/save-token')
  async saveFcmToken(@Body() payload: SaveNotificationData, @Res() res: Response) {
    try {
      const result = await this.notificationService.saveFcmToken(payload)
      if (!result) {
        return res.json({ data: [], status: HttpStatus.CONFLICT, err: [], message: "Token is not saved" })
      }
      return res.json({ data: [], status: HttpStatus.CREATED, err: [], message: "Token saved SuccessFully" })
    }
    catch (err) {
      return res.json({ data: [], status: HttpStatus.INTERNAL_SERVER_ERROR, err: [err?.message] })
    }
  }

  // 🔹 Send Notification
  @Post('/send')
  async sendNotification(@Body() body: { token: string; title: string; message: string }) {
    return this.notificationService.sendNotification(body.token, body.title, body.message);
  }
}
