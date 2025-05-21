import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService){}

    async create(userDto: CreateUserDto){
        const user = await this.prisma.user.findUnique({
            where: {
                email: userDto.email,
            }
        });

        if (user) throw new ConflictException('email duplicated');
        
        const newUser = await this.prisma.user.create({
            data: {
                ...userDto
            }
        })
    }
}
