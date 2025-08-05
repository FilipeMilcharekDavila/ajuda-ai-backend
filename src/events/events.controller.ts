import { Controller, Get, Post, Body, Param, UseGuards, Req, UseInterceptors, UploadedFile, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserType, User } from '../users/user.entity';
import { RequestWithUser } from '../types/request-with-user.interface';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { UpdateEventDto } from './dto/update-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ORGANIZADOR)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: RequestWithUser) {
    const user = req.user;
    return this.eventsService.create(createEventDto, user);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ORGANIZADOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto, @Req() req: RequestWithUser) {
    return this.eventsService.update(+id, updateEventDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ORGANIZADOR)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.eventsService.remove(+id, req.user);
  }

  @Post('category')
  createCategory(@Body('nome') nome: string) {
    return this.eventsService.createCategory(nome);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/subscribe')
  subscribe(@Param('id') id: string, @Req() req: RequestWithUser) {
    const userId = req.user.userId;
    return this.eventsService.subscribe(+id, userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ORGANIZADOR)
  @Post(':id/avisos')
  createAviso(
    @Param('id') id: string,
    @Body() createAvisoDto: CreateAvisoDto,
    @Req() req: RequestWithUser,
  ) {
    return this.eventsService.createAviso(+id, createAvisoDto, req.user);
  }

  @Get(':id/avisos')
  findAvisos(@Param('id') id: string) {
    return this.eventsService.findAvisosByEventId(+id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ORGANIZADOR)
  @Delete('avisos/:avisoId')
  @HttpCode(HttpStatus.OK)
  deleteAviso(
    @Param('avisoId') avisoId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.eventsService.deleteAviso(+avisoId, req.user);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
        return cb(null, `${randomName}${(file.originalname)}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { imageUrl: `http://localhost:3000/uploads/${file.filename}` };
  }
}