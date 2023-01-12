import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategy';

@Injectable()
class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private strategy: JwtStrategy,
  ) {}
  async signup(dto: AuthDTO) {
    try {
      const { email, password } = dto;
      const hashPwd = await argon.hash(password);
      const user = await this.prismaService.user.create({
        data: {
          email,
          hash: hashPwd,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
          email: true,
          firstName: true,
          lastname: true,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new ForbiddenException('Credentials already taken');
      }
      throw error;
    }
  }
  async signin(dto: AuthDTO) {
    try {
      const { email, password } = dto;
      const user = await this.prismaService.user.findFirst({
        where: { email: email },
      });
      if (!user) throw new ForbiddenException('Incorrect credentials');

      const pwdMatches = await argon.verify(user.hash, password);
      if (!pwdMatches) throw new ForbiddenException('Incorrect credentials');
      return this.signToken(user.id, user.email);
    } catch (error) {}
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    try {
      const payload = {
        sub: userId,
        email,
      };
      const token = await this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      });
      return { access_token: token };
    } catch (error) {
      return error;
    }
  }
}

export { AuthService };
