import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserType } from '../users/user.entity';
import { RequestWithUser } from '../types/request-with-user.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserType.ORGANIZADOR)
  @Post()
  create(@Body() createEventDto: CreateEventDto, @Req() req: RequestWithUser) {
    const user = req.user;
    return this.eventsService.create(createEventDto, user as any);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(+id);
  }

  @Post('category')
  createCategory(@Body('nome') nome: string) {
    return this.eventsService.createCategory(nome);
  }
}
