import { Injectable, CanActivate, ExecutionContext, NotFoundException, MethodNotAllowedException } from '@nestjs/common';

@Injectable()
export class EmailVerificationGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user

    if (user || user?.emailVerified) {
      return true
    }
    return false

  }
}
