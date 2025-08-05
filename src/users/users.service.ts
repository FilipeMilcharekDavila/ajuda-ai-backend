import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from '../auth/dto/create-user.dto';
import { Inscricao } from '../events/entities/inscricao.entity';
import { Event } from '../events/entities/event.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Inscricao)
    private inscricaoRepository: Repository<Inscricao>,
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto, hashedPassword: string): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserDto,
      senha_hash: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findMyEvents(userId: number): Promise<{ created: Event[], subscribed: Event[] }> {
    const created = await this.eventsRepository.find({
      where: { organizador: { id: userId } },
      relations: ['organizador', 'categoria'],
      order: { data_evento: 'ASC' },
    });

    const subscriptions = await this.inscricaoRepository.find({
      where: { usuario: { id: userId } },
      relations: ['evento', 'evento.organizador', 'evento.categoria'],
      order: { evento: { data_evento: 'ASC' } },
    });
    const subscribed = subscriptions.map(sub => sub.evento);

    return { created, subscribed };
  }
}
