import { RoleEnum } from "@common"

export const getUserDretails = (userId: string, collectionName: string): string => {
    return `SELECT * FROM \`${collectionName}\` WHERE META().id LIKE "${collectionName}::${userId}%" AND isDeleted=FALSE `
}

export const updateToken = (userId: string, collection: string, tokens: string[]): string => {
    return `UPDATE \`${collection}\` SET token=${JSON.stringify(tokens)}
            WHERE META().id ="${collection}::${userId}"
            RETURNING *`
}

export const getAdminUserDetails = (colectionName: string): string => {
    return ` SELECT id,token FROM  \`${colectionName}\` WHERE \`role\` = ${RoleEnum.ADMIN} AND isDeleted=false`
}