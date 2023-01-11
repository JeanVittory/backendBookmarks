import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto';

@Controller('auth')
class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(
    @Body('email') email: string,
    @Body('password', ParseIntPipe) password: string,
  ) {
    console.log({
      email,
      password,
    });
    return this.authService.signup();
  }

  @Post('signin')
  signin() {
    return this.authService.signin();
  }
}

export { AuthController };
