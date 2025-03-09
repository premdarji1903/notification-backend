import { IsNotEmpty, IsString } from "class-validator";

export class SendNotificationDTO {

    @IsString()
    @IsNotEmpty()
    userName: string;

    @IsString()
    @IsNotEmpty()
    userId: string;
}