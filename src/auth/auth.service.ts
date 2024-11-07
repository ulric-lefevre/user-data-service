import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash, compare } from 'bcrypt';
import { AuthBody } from './types';
import { UUID } from 'crypto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService) { }
    async signup(authBody: AuthBody) {
        const { email, password } = authBody;
        const hashedPassword = await hash(password, 10);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    password: hashedPassword
                }
            });
            return this.signToken(user.id, user.email);
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException('Email already exists');
            }
        }


    }

    async signin(authBody: AuthBody) {
        const { email, password } = authBody;
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })
        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            throw new ForbiddenException('Invalid credentials');
        }
        return this.signToken(user.id, user.email);
    }

    private async signToken(id: string, email: string) {
        const payload = { sub: id, email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
