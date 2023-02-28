import { Request, Response, NextFunction } from 'express';
import HttpException from '@/utils/exceptions/http.exception';

async function authenticationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    try {

        if (req.get('Authorization')) {
            return next();
        } else {
            return next(new HttpException(401, 'Unauthorised'));   
        }

    } catch (error) {
        return next(new HttpException(401, 'Unauthorized'));
    }
}

export default authenticationMiddleware;