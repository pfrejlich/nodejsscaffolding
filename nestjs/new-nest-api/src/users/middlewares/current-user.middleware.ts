import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';

export interface RequestModel extends Request {
  currentUser?: User;
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(@Inject('IUsersService') private usersService: UsersService) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }

    next();
  }
}
