import { Module } from "@nestjs/common";
import { RegistrController } from "./register.controller";
import { RegisterService } from "./register.service";

@Module({
    controllers: [RegistrController],
    providers: [RegisterService],
})
export class RegisterModule {

}