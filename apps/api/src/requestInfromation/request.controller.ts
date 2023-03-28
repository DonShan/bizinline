import { Body, Controller, Post } from "@nestjs/common";
import { RequestDto } from "./dto/request.dto";
import { RequestService } from "./requestservice";

@Controller("request")
export class RequestController {
    constructor(private requestService: RequestService){}
    @Post('for-bizinline')
    async resetPassword(@Body() dto: RequestDto) {
        return this.requestService.registerforbizinline(dto);
    }
}