import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { Category } from './entities/category.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Inscricao } from './entities/inscricao.entity';
import { Aviso } from './entities/aviso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Category, Inscricao, Aviso]),
    AuthModule,
    UsersModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}