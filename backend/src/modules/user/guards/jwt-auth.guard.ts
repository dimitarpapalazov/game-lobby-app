import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private readonly redisClient: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. Verify JWT signature
      const decoded = this.jwtService.verify(token);
      request.user = decoded; // attach user payload to request

      // 2. Check Redis to see if token is still valid
      const storedToken = await this.redisClient.get(`user:${decoded.sub}:token`);
      if (!storedToken || storedToken !== token) {
        throw new UnauthorizedException('Token expired or invalidated');
      }

      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
