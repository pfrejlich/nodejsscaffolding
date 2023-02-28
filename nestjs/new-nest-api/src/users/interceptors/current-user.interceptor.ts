import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  Inject,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { IUsersService } from '../users.service';

/**
 * Replaced by current-user.middleware.ts. Left here as an example of an interceptor
 */

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(@Inject('IUsersService') private usersService: IUsersService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.usersService.findOne(userId);
      request.currentUser = user;
      return next.handle();
    }

    return next.handle();
  }
}
