import { UserService } from './user.service';
import { BadRequestException, Body, ConflictException, Controller, Delete, ForbiddenException, Get, InternalServerErrorException, Param, ParseArrayPipe, Post, Put, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Users } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/auth/role.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './role.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ALTCreateUser } from './dto/signup-userR.dto';
import { query } from 'express';
import { ModifyUserDto } from './dto/modify-user.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Get('admin/list-users')
    async getAllusers(@Query('page') page: number, @Query('limit') limit: number) {
        return await this.userService.getAlluser(page, limit);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Put('admin/modify-user/:id')
    async modifyUser(
      @Param('id') id: number,
      @Body() modifyUserDto: ModifyUserDto
    ) {
      try {
        return await this.userService.modifyUser(
          id,
          modifyUserDto.username,
          modifyUserDto.email
        );
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Email already exists.');
        }
        throw new InternalServerErrorException();
      }
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Delete('admin/delete-user/:id')
    async deletteUser(
        @Param('id') id: number
    ) {
        return await this.userService.deleteUser(id);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Post('admin/create-user')
    async altcreateuser(@Body() altcreateuserDTO: ALTCreateUser) {
        return await this.userService.altSignup(altcreateuserDTO);
    }

    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RoleGuard)
    @Put('admin/change-role')
    async changeRole(
        @Query('userId') userId: number, 
        @Query('currentUserId') currentUserId: number
    ) {
        return await this.userService.changeRole(userId, currentUserId);
    }

    // @UseGuards(AuthGuard)
    // @Post()
    // createUser(@Body() signupUserRDto: SignupUserRDto , @Req() req: any): Promise<Users> {
    //     if (req.user_data.role !== 'admin' && signupUserRDto.role && signupUserRDto.role !== 'user') {
    //         throw new ForbiddenException('Permission denied');
    //     }
    //     return //this.userService.create(signupUserRDto);
    // }

}
