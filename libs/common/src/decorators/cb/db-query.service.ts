import { Logger } from '@nestjs/common';
import * as couchbase from "couchbase"

export const couchBaseFunctions = async (bucketName: string, scopeName: string) => {
    const clusterConnStr: string | any = process.env.COUCHBASE_URL;
    const username: string | any = process.env.CB_USERNAME;
    const password: string | any = process.env.PASSWORD;
    try {
        const cluster = await couchbase.connect(clusterConnStr, {
            username: username,
            password: password,
        });

        return {
            query: async (
                query: string,
            ): Promise<any> => {
                try {
                    const bucket = cluster.bucket(bucketName);
                    const scope = bucket.scope(scopeName);
                    return await scope.query(query);
                } catch (e) {
                    Logger.error('Error occurred in CouchBase query------->', e);
                    throw e;
                }
            },
            cluster,
            get: async (
                id: string, collectionname: string
            ): Promise<any> => {
                try {
                    return await cluster.bucket(bucketName).scope(scopeName).collection(collectionname).get(id);
                } catch (e) {
                    Logger.error('Error occurred in CouchBase get function------->', e);
                    throw e;
                }
            },

            touch: async (
                id: string,
                time: number,
                collectionName: string
            ): Promise<any> => {
                try {
                    const collection = cluster.bucket(bucketName).scope(scopeName).collection(collectionName);
                    return await collection.touch(id, time);
                } catch (e) {
                    Logger.error('Error occurred in CouchBase touch function------->', e);
                    throw e;
                }
            },

            create: async (
                id: string,
                payload: any,
                collectionName: string,
                ttlInSeconds?: number
            ): Promise<any> => {
                try {
                    const collection = cluster.bucket(bucketName).scope(scopeName).collection(collectionName);
                    return await collection.insert(id, payload, { expiry: ttlInSeconds });
                } catch (e) {
                    Logger.error('Error occurred in CouchBase create function------->', e);
                    throw e;
                }
            }
        }
    }
    catch (err) {
        Logger.log("err---->", err?.message);
        throw err?.message
    }
};

