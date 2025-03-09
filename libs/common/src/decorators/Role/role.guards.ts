import { Metadata } from '@grpc/grpc-js';
import { Injectable, CanActivate, ExecutionContext, Logger, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { cb } from '../cb';
import { QueryResult } from 'couchbase';
import { svcList, collection, RoleEnum } from '../../enums';
// import { svcList } from '../../enums/services-enum';

@Injectable()
export class RoleGuards implements CanActivate {
    constructor(private reflector: Reflector) { }

    @cb()
    async shb({ ...options }: any): Promise<any> {
        return options
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const roles: number[] = this.reflector.get<number[]>('Role', context.getHandler());

            if (!roles.length || roles[0] < RoleEnum.ADMIN) {
                throw new ForbiddenException('You are not allowed to make this request');
            }

            const request = context.switchToHttp().getRequest();
            const authHeader = request.headers['authorization']; // Get Authorization header

            if (!authHeader) {
                throw new ForbiddenException('Authorization header missing');
            }

            const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

            if (!token) {
                throw new ForbiddenException('Invalid Authorization token');
            }
            const sessionSHB = await this.shb({
                bucketName: svcList.AUTH_SVC,
                scopeName: collection.USER,
            });
            let findSessionData: QueryResult = await sessionSHB.query(`SELECT id,userId FROM Session WHERE META().id like "${collection.SESSION}::${token}%" `);

            findSessionData = findSessionData?.rows[0]
            if (!findSessionData) {
                throw new ForbiddenException('Your session is expired');
            }
            else {
                return true;
            }
        }
        catch (err) {
            Logger.error("Error Occur in role guards----->", err?.message)
            throw new ForbiddenException('Your session is expired');
        }
    }
}
