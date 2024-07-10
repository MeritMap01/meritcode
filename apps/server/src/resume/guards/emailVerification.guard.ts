import { Injectable, CanActivate, ExecutionContext, NotFoundException, MethodNotAllowedException } from '@nestjs/common';

@Injectable()
export class EmailVerificationGuard implements CanActivate {

  canActivate(
    context: ExecutionContext,
  ): boolean{
    const request = context.switchToHttp().getRequest();
    const user = request.user
    console.log(user)
  
      if (!user || !user.emailVerified) {
        throw new MethodNotAllowedException("User Email is not Verified..")
      }
      return true
    
  }
}
