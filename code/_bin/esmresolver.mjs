import path from 'path';

const cache = {};

export default function resolver(handlersPath, route, apiDoc) {
    const { basePath, expressRoute, openApiRoute, method } = route;
    const pathKey = openApiRoute.substring(basePath.length);
    const schema = apiDoc.paths[pathKey][method.toLowerCase()];
    const oId = schema['x-eov-operation-id'] || schema['operationId'];
    const baseName = schema['x-eov-operation-handler'];

    const cacheKey = `${expressRoute}-${method}-${baseName}`;

    if (!cache[cacheKey]) {
        if (oId && !baseName) {
            // eslint-disable-next-line max-len
            throw Error(`found x-eov-operation-id for route [${method} - ${expressRoute}]. x-eov-operation-handler required.`);
        }
        if (!oId && baseName) {
            // eslint-disable-next-line max-len
            throw Error(`found x-eov-operation-handler for route [${method} - ${expressRoute}]. x-eov-operation-id required.`);
        }
        if (oId && baseName && typeof handlersPath === 'string') {
            const modulePath = "file://" + path.join(handlersPath, `${baseName}.mjs`);
            cache[cacheKey] = import(modulePath);
        }
    }

    return (req, res, next) => {
        cache[cacheKey]
            .then((module) => {
                const m = module[oId];
                if (!m) {
                    // eslint-disable-next-line max-len
                    throw Error(`Could not find 'x-eov-operation-handler' with id ${oId} in module '${baseName}'. Make sure operation '${oId}' defined in your API spec exists as a handler function in '${baseName}'.`);
                }
                return m(req, res, next);
            })
            .catch(next);
    };
}