import { Controller, Post, Body, Res, HttpStatus, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { SaveNotificationData } from './dto/save-notificationd-request-dto';
import { Role, RoleEnum } from '@common';
import { Response } from 'express';
import { SendNotificationDTO } from './dto/send-notification-dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) { }

  @Role(RoleEnum.ADMIN)
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
  @Post('/send-notification')
  async sendNotification(@Body() payload: SendNotificationDTO, @Res() res: Response) {
    try {
      const result = await this.notificationService.sendNotification(payload)

      if (!result) {
        return res.json({ status: HttpStatus.CONFLICT, err: [], message: "Notification Not Sent" })
      }

      return res.json({ status: HttpStatus.OK, err: [], message: "Notification Sent SuccessFully" })

    }
    catch (err) {
      return res.json({ status: HttpStatus.INTERNAL_SERVER_ERROR, err: [err?.message] })
    }
  }

  // @Role(RoleEnum.ADMIN)
  @Get('/get-notifications')
  async getNotification(@Res() res: Response) {
    try {
      const result = await this.notificationService.getNotificationData()

      if (!result?.length) {
        return res.json({ status: HttpStatus.NOT_FOUND, data: [], message: "Notification Data Not Found" })
      }

      return res.json({ status: HttpStatus.OK, data: result, message: "Notification Data Found SuccessFully" })

    }
    catch (err) {
      return res.json({ status: HttpStatus.INTERNAL_SERVER_ERROR, err: [err?.message] })
    }
  }
}
