import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret} from '../utils/constans';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async signup(dto: AuthDto) {
        const {email, password} = dto

        const userExists = await this.prisma.user.findUnique({where: {email}})

        if (userExists) {
            throw new BadRequestException('user already exists')
        }

        const hashedPassword = await this.hashPassword(password)

        await this.prisma.user.create({
            data: {
                email,
                hashedPassword
            }
        })

        return { message: 'signup was successful' }
    }


    async signin(dto: AuthDto, req: Request, res: Response) {
        const {email, password} = dto

        const foundUser = await this.prisma.user.findUnique({
            where: {
                email
            },
        })

        if (!foundUser) {
            throw new BadRequestException('Wrong credentials')
        }

        const isMatch = await this.comparePasswords({password, hash: foundUser.hashedPassword})

        if (!isMatch) {
            throw new BadRequestException('Wrong Credentials');
        }

        const token = await this.signToken({
            id: foundUser.id,
            email: foundUser.email
        })

        if (!token) {
            throw new ForbiddenException()
        }

        res.cookie('token', token)

        return res.send({message: 'Logged In Successfully'})
    }
    

    async signout(req: Request, res: Response) {
        res.clearCookie('token')
        return res.send({message: 'Logged out Successfully'})
    }

    async hashPassword(password: string) {
        const salt0rRounds = 10;

        return await bcrypt.hash(password, salt0rRounds)
    }

    async comparePasswords(args: {password: string; hash: string}) {
        return await bcrypt.compare(args.password, args.hash);
    }
    
    async signToken(args: {id: string, email: string}) {
        const payLoad = args;

        return this.jwt.signAsync(payLoad, {secret: jwtSecret})
    }
}
