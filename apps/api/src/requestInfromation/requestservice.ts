import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { RequestDto } from "./dto/request.dto";


@Injectable()
export class RequestService{
    constructor(private prisma: PrismaService,private config: ConfigService,){}
    async registerforbizinline(dto: RequestDto) {
        try {
            const requestInfo = await this.prisma.requestInfromation.create({
                data: {
                    email: dto.email,
                    companyName: dto.companyName,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    phoneNumber: dto.phoneNumber
                },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('All fields are required');
                } else if (error.code === 'P2025') {
                    throw new BadRequestException('Invalid input provided');
                } else if (error.code === 'P2020') {
                    throw new NotFoundException('Resource not found');
                } else {
                    throw new InternalServerErrorException('Something went wrong');
                }
            } else {
                throw new InternalServerErrorException('Something went wrong');
            }
        }
    }
}    