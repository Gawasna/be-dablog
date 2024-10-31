import { UserService } from './user.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, ParseArrayPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './role.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService:UserService ) {}

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('all')
    findAll(): Promise<Users[]> {
        return this.userService.findAll();
    }
}
