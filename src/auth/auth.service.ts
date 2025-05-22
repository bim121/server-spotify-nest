import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';

const EXPIRE_TIME = 20 * 1000;

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto);
    const payload = {
      username: user.email,
      userId: user.id,
      sub: {
        name: user.name,
      },
    };

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '20s',
          secret: this.configService.get<string>('jwtSecretKey')
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: this.configService.get<string>('jwtRefreshTokenKey'),
        }),
        expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
      },
    };
  }

  async validateUser(dto: LoginDto) {
    const user = await this.userService.findByEmail(dto.username);

    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    throw new UnauthorizedException();
  }

  async refreshToken(user: any) {
    const payload = {
      username: user.username,
      userId: user.id,
      sub: user.sub,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '20s',
        secret: this.configService.get<string>('jwtSecretKey'),
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: this.configService.get<string>('jwtRefreshTokenKey'),
      }),
      expiresIn: new Date().setTime(new Date().getTime() + EXPIRE_TIME),
    };
  }
}