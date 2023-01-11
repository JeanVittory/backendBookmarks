import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
class AuthService {
  constructor(private prismaService: PrismaService) {}
  signup() {
    return { message: 'Hello from NestJS' };
  }
  signin() {
    return { message: 'Hello from NestJS' };
  }
}

export { AuthService };
