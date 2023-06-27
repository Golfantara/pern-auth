import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { jwtSecret } from "src/utils/constans";
import { Request } from 'express'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super( {
            jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWT]),
            secretOrKey: jwtSecret,
        })
    }
    private static extractJWT(req: Request): string | null {
        if (req.cookies && 'token' in req.cookies) {
            return req.cookies.token;
        }
        return null;
    }

    async validate(payLoad: { id: string; email: string}) {
        return payLoad
    }
}