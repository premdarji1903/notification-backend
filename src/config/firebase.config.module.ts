import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { FirebaseService } from './firebase.config.service';

@Module({
    providers: [
        {
            provide: 'FIREBASE_ADMIN',
            useFactory: (configService: ConfigService) => {
                const firebaseConfig = {
                    type: configService.get<string>('FIREBASE_TYPE'),
                    project_id: configService.get<string>('FIREBASE_PROJECT_ID'),
                    private_key_id: configService.get<string>('FIREBASE_PRIVATE_KEY_ID'),
                    private_key: configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
                    client_email: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
                    client_id: configService.get<string>('FIREBASE_CLIENT_ID'),
                    auth_uri: configService.get<string>('FIREBASE_AUTH_URI'),
                    token_uri: configService.get<string>('FIREBASE_TOKEN_URI'),
                    auth_provider_x509_cert_url: configService.get<string>('FIREBASE_AUTH_PROVIDER_CERT_URL'),
                    client_x509_cert_url: configService.get<string>('FIREBASE_CLIENT_CERT_URL'),
                };

                return admin.initializeApp({
                    credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
                    databaseURL: configService.get<string>('FIREBASE_DATABASE_URL'),
                });
            },
            inject: [ConfigService],
        },
        FirebaseService
    ],
    exports: ['FIREBASE_ADMIN', FirebaseService],
})
export class RootFirebaseModule { }

export class FirebaseModule {
    static forRootAsync(): DynamicModule {
        return {
            module: RootFirebaseModule,
            imports: [ConfigModule.forRoot({ isGlobal: true })],
        }
    }
}
