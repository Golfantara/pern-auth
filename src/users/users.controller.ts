import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthguard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthguard)
  @Get('/:id')
    getMyUser(@Param() params: {id: string}, @Req() req) {
      this.usersService.getMyUser(params.id, req)
    }

    @Get()
    getUsers() {
     return this.usersService.getUsers()
    }
}
