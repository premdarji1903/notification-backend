import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleGuards } from './role.guards';
export function Role(...roles: any) {
    return applyDecorators(
        SetMetadata('Role', roles),
        UseGuards(RoleGuards)
    );
}