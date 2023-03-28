import { Module } from "@nestjs/common";
import { RequestController } from "./request.controller";
import { RequestService } from "./requestservice";


@Module({
    controllers: [RequestController],
    providers: [RequestService],
})
export class RequestModule {

}