import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async getMyUser(id: string) {

        const user = await this.prisma.user.findUnique({ where: { id }});

        console.log(user)
        return user;
    }

    async getUsers() {
        return await this.prisma.user.findMany({
            select: {id: true, email: true}
        });
    }
}
