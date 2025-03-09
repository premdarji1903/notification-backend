import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) { }

  async sendNotification(token: string, title: string, body: string) {
    const tokens = [token]
    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    try {
      const response = await this.firebaseAdmin.messaging().sendEachForMulticast(message);
      return response;
    } catch (error) {
      return error
    }
  }
}
