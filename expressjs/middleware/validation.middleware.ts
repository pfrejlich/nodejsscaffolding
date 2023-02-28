import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

function validationMiddleware(
    schema: Joi.Schema,
    property: string
): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOptions = {
            abortEarly: false, // accumulate validation errors
            allowUnknown: true, // allow out-of-schema properties without failing
            stripUnknown: true, // removes out-of-schema properties, cleaning the request
        };

        try {
            let requestSection = null;
            switch (property) {
                case 'body':
                    requestSection = req.body;
                    break;
                case 'query':
                    requestSection = req.query;
                    break;
                case 'route':
                    requestSection = req.route;
                    break;
            }

            const value = await schema.validateAsync(
                requestSection,
                validationOptions
            );
            req.body = value;
            next();
        } catch (e: any) {
            const errors: string[] = [];
            e.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            res.status(400).send({ errors: errors });
        }
    };
}

export default validationMiddleware;
