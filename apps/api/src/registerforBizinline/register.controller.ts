import { Body, Controller, Post } from "@nestjs/common";
import { RegisterDto } from "./dto/register.dto";
import { RegisterService } from "./register.service";



@Controller("register")
export class RegistrController {
    constructor(private registerService: RegisterService){}
    
    @Post('for-bizinline')
    async resetPassword(@Body() dto: RegisterDto) {
        return this.registerService.registerforbizinline(dto);
    }
}