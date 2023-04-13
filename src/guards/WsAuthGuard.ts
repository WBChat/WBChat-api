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
export class WsAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToWs().getClient<{ handshake: CommonRequest }>()

      const authHeader = req.handshake.headers.authorization

      const token = authHeader?.split(' ')

      const user = this.jwtService.verify<UserTokenPayload>(token?.[1] ?? '')
      context.switchToWs().getData().user = user

      return true
    } catch (e) {
      throw new UnauthorizedException({ message: 'Token is not valid' })
    }
  }
}
