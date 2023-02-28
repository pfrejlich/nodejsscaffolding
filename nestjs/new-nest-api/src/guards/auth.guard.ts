import { CanActivate, ExecutionContext } from '@nestjs/common';
import { BYPASS_KEY } from './bypassauth.decorator';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const skipAutorization = Reflect.getMetadata(
      BYPASS_KEY,
      context.getHandler(),
    );

    if (skipAutorization) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
