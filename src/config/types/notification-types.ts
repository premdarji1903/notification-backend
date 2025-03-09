export type NotificationSaved = {
    id: string;
    userId: string;
    userName: string;
    notification: NotificationDetails,
    createdAt: Date;
    updatedAt: Date;
}

export type NotificationDetails = {
    title: string;
    body: string;
}