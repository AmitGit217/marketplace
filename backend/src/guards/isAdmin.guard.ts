import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

export class IsAdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || user.role !== 'admin') {
      throw new UnauthorizedException('You do not have permission to access this resource');
    }

    return true;
    }


 }