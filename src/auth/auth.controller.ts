import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthBody } from './types';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('signup')
    signup(@Body() authBody: AuthBody) {
        return this.authService.signup(authBody);
    }

    @Post('signin')
    signin(@Body() authBody: AuthBody) {
        return this.authService.signin(authBody);
    }
}
