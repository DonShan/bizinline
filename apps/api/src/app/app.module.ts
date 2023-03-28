import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RegisterModule } from '../registerforBizinline/register.module';
import { RequestModule } from '../requestInfromation/request.module';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    AuthModule,
    UserModule,
    RegisterModule,
    RequestModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
})
export class AppModule { }