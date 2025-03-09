import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FirebaseService } from 'src/config/firebase.config.service';
import { SaveNotificationData } from './dto/save-notificationd-request-dto';
import { cb, collection, RoleEnum, svcList } from '@common';
import { getAdminUserDetails, getNotificationData, getUserDretails, updateToken } from './shadowSQL';
import { QueryResult } from 'couchbase';
import { SendNotificationDTO } from './dto/send-notification-dto';

@Injectable()
export class NotificationService {
  constructor(private readonly fireBaseService: FirebaseService) { }

  @cb()
  async shb({ ...options }: any): Promise<any> {
    return options
  }

  // 🔹 Save FCM Token for a User
  async saveFcmToken(payload: SaveNotificationData) {
    try {
      const userSHB = await this.shb({
        bucketName: svcList.AUTH_SVC,
        scopeName: collection.USER
      })

      let getUserData = await userSHB.query(getUserDretails(payload?.userId, collection.USER))
      getUserData = getUserData?.rows[0]?.User

      if (!getUserData || getUserData?.role < RoleEnum.ADMIN) {
        return false
      }
      let tokens = getUserData?.token?.length ? getUserData?.token : []
      tokens.push(payload?.token)
      tokens = [...new Set(tokens)]

      if (!tokens.length) {
        return false
      }

      const updateTokens: QueryResult = await userSHB.query(updateToken(payload?.userId, collection.USER, tokens))
      if (!updateTokens?.rows?.length) {
        return false
      }
      return true
    } catch (error) {
      console.error('Error saving FCM token:', error);
      return false
    }
  }

  // 🔹 Send a Notification
  async sendNotification(payload: SendNotificationDTO) {
    try {

      const userSHB = await this.shb({
        bucketName: svcList.AUTH_SVC,
        scopeName: collection.USER
      })

      let getAdminUserDetail = await userSHB.query(getAdminUserDetails(collection.USER))
      getAdminUserDetail = getAdminUserDetail?.rows[0]?.token

      const notifications: any = await this.fireBaseService.sendNotification(getAdminUserDetail, payload?.userName, payload?.userId)

      if (!notifications) {
        return false
      }
      return true
    } catch (error) {
      Logger.error('Error sending notification:', error);
      return false
    }
  }

  async getNotificationData() {
    try {
      const notificationSHB = await this.shb({
        bucketName: svcList.AUTH_SVC,
        scopeName: collection.USER
      })
      let notificationData = await notificationSHB.query(getNotificationData(collection.NOTIFICATION))
      notificationData = notificationData?.rows
      if (!notificationData?.length) {
        return []
      }

      return notificationData
    }
    catch (err) {
      Logger.error('Error get notification -------->', err);
      return false
    }
  }
}
