import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

import OpenApiValidator from 'express-openapi-validator';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import resolver from './esmresolver.mjs';
import {JWT_SECURITY} from "../lib/security.mjs";
import {bootstrapDb} from "../lib/database.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const BASE_PATH = `${__dirname}/../components`;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.3",
        info: {
            title: "+Role",
            version: "1.0.0",
            description: "Server Authentication API"
        },
        servers: [{
            url: "http://localhost:3001/api",
            description: "+Role"
        }]
    },
    apis: [
        `${BASE_PATH}/**/*.yaml`,
        `${BASE_PATH}/**/*.mjs`
    ]
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
delete swaggerDocs.channels;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(OpenApiValidator.middleware({
    apiSpec: swaggerDocs,
    validateSecurity: {
        handlers: {
            JWT: JWT_SECURITY
        }
    },
    operationHandlers: {
        basePath: BASE_PATH,
        resolver
    }
}));

app.use(express.static(`${__dirname}/../public`));


bootstrapDb().catch(console.error);
export default app;