import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Observable } from 'rxjs'
import { UserTokenPayload } from 'src/core/Users/types'
import { CommonRequest } from 'src/types/request'

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest<CommonRequest>()

      const authHeader = req.headers.authorization
      const token = authHeader?.split(' ')

      const user = this.jwtService.verify<UserTokenPayload>(token?.[1] ?? '')
      req.user = user

      return true
    } catch (e) {
      throw new UnauthorizedException({ message: 'Token is not valid' })
    }
  }
}
