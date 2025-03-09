import { couchBaseFunctions } from "./db-query.service";

export const cb = (): MethodDecorator => {
    return (
        target: object,
        key: string,
        descriptor: TypedPropertyDescriptor<any>
    ) => {
        descriptor.value = async function ({ ...args }: any) {
            const bucketName = args?.bucketName;
            const scopeName = args?.scopeName; 
            return await couchBaseFunctions(bucketName, scopeName);
        };
    };
};
