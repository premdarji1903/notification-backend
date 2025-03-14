import { IsNotEmpty, IsString } from "class-validator";

export class SaveNotificationData {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    token: string;
}
