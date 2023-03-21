import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common';

import { AuthDto } from './dto/auth.dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService,
    ) { }

    async signup(dto: AuthDto, role: string) {
        //generate the password hash
        const hash = await argon.hash(dto.password);

        // generate password reset token
        const resetToken =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);

        // set password reset token expiration time
        const resetTokenExpires = new Date(Date.now() + 3600000); // token will expire in 1 hour

        // save new user to db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                    resetToken,
                    resetTokenExpires,
                    role, // add role here
                },
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials taken');
                }
            }
            //throw error;
            console.log(error.code);
        }
    }
    //find exsisting user from db
    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email,
            },
        });

        if (!user) throw new ForbiddenException('Credentials incorrect');

        const pwMatches = await argon.verify(user.hash, dto.password);

        if (!pwMatches) throw new ForbiddenException('Credentials incorrect');

        // check user's role
        if (user.role !== 'admin' && user.role !== 'user' && user.role) {
            throw new ForbiddenException('Invalid role');
        }

        return this.signToken(user.id, user.email);
    }
    //Jwt token genaration
    async signToken(
        userId: number,
        email: string,
    ): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email,
        };

        const secret = this.config.get('JWT_SECRET');

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: 'secret',
        });

        return {
            access_token: token,
        };
    }
    //send password reset email
    async sendPasswordResetEmail(email: string) {
        const resetToken =
            Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15);
        const resetTokenExpires = new Date();
        resetTokenExpires.setMinutes(resetTokenExpires.getMinutes() + 15);

        await this.prisma.user.update({
            where: { email },
            data: { resetToken, resetTokenExpires },
        });

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: 'msdjshan47@gmail.com',
                pass: 'hdkbzcgcsfdvsgjy',
            },
            tls: {
                rejectUnauthorized: true,
            },
            authMethod: 'PLAIN',
        });

        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            text: `Please click on the following link to reset your password: http://localhost:3000/reset-password?resetToken=${resetToken}`,
        };

        transporter.sendMail(
            {
                from: 'msdjshan47@gmail.com',
                to: email,
                subject: 'Test Email',
                text: `Please click on the following link to reset your password: http://localhost:3300/reset-password?resetToken=${resetToken}`,
            },
            (error, info) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            },
        );
    }
    async resetPassword(resetToken: string, password: string) {
        try {
            // Find the user with the matching reset token
            const user = await this.prisma.user.findUnique({
                where: {
                    resetToken,
                },
            });

            if (!user) {
                throw new ForbiddenException('Invalid reset token');
            }

            // Check if the reset token has expired
            const now = new Date();
            if (user.resetTokenExpires < now) {
                throw new ForbiddenException('Reset token has expired');
            }

            // Hash the new password
            const hash = await argon.hash(password);

            const newResetToken =
                Math.random().toString(36).substring(2, 15) +
                Math.random().toString(36).substring(2, 15);
            const newRresetTokenExpires = new Date();
            newRresetTokenExpires.setMinutes(newRresetTokenExpires.getMinutes() + 15);

            // Update the user's password hash and clear the reset token
            const updatedUser = await this.prisma.user.update({
                where: {
                    id: user.id,
                },
                data: {
                    hash,
                    resetToken: newResetToken,
                    resetTokenExpires: newRresetTokenExpires,
                },
            });

            return this.signToken(updatedUser.id, updatedUser.email);
        } catch (error) {
            if (error instanceof ForbiddenException) {
                throw error;
            }
            throw new InternalServerErrorException();
        }
    }
}
