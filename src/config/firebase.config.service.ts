import { cb, collection, svcList } from '@common';
import { CommonService } from '@common';
import { Injectable, Inject, Logger } from '@nestjs/common';
import { MutationResult } from 'couchbase';
import * as admin from 'firebase-admin';
import { NotificationSaved } from './types';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App, private readonly commonService: CommonService) { }

  @cb()
  private async shb({ ...options }: any): Promise<any> {
    return options
  }

  async sendNotification(tokens: string[], userName: string, userId: string) {
    const message = {
      notification: {
        title: "New User Registered!",
        body: `A new user, ${userName}, has just signed up in Portal App.`
      },
      tokens,
    };

    try {
      const response = await this.firebaseAdmin.messaging().sendEachForMulticast(message);
      if (!response?.successCount || response?.successCount <= 0) {
        return false
      }
      const savedResult = await this.savedNotificationData(message, userName, userId)
      if (!savedResult) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

  async savedNotificationData(message: any, userName: string, userId: string) {
    try {
      const notificationShb = await this.shb({
        bucketName: svcList.AUTH_SVC,
        scopeName: collection.USER
      })
      const uniqueId: string = this.commonService.getRandomId(8)
      const payload: NotificationSaved = {
        id: uniqueId,
        userId,
        userName,
        notification: message?.notification,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      const savedNotificationData: MutationResult = await notificationShb.create(`${collection.NOTIFICATION}::${uniqueId}`, payload, collection.NOTIFICATION)
      if (savedNotificationData?.token) {
        return true
      }
      return false
    }
    catch (err) {
      Logger.error("Error Occured While Saving Notification Data------->", err?.message)
    }
  }
}
