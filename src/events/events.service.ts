import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/user.entity';
import { Category } from './entities/category.entity';
import { UsersService } from '../users/users.service';
import { Inscricao } from './entities/inscricao.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventsRepository: Repository<Event>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly usersService: UsersService,
    @InjectRepository(Inscricao)
    private inscricaoRepository: Repository<Inscricao>,
  ) {}

  // LÓGICA DO MÉTODO 'create' CORRIGIDA
  async create(createEventDto: CreateEventDto, requestingUser: { userId: number }): Promise<Event> {
    // 1. Obter o objeto completo do utilizador a partir do banco de dados
    const organizador = await this.usersService.findOneById(requestingUser.userId);
    if (!organizador) {
      throw new NotFoundException('Utilizador organizador não encontrado.');
    }

    // 2. Obter a categoria
    const { categoriaId, ...eventData } = createEventDto;
    const categoria = await this.categoryRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) {
      throw new BadRequestException(`Categoria com ID #${categoriaId} não encontrada.`);
    }

    // 3. Criar o evento com as entidades completas
    const event = this.eventsRepository.create({
      ...eventData,
      organizador: organizador, // Usar o objeto completo do organizador
      categoria: categoria,
      data_evento: new Date(createEventDto.data_evento),
    });
    return this.eventsRepository.save(event);
  }

  findAll(): Promise<Event[]> {
    return this.eventsRepository.find({ relations: ['organizador', 'categoria'] });
  }

  async findOne(id: number): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['organizador', 'categoria'] });
    if (!event) {
      throw new NotFoundException(`Evento com ID #${id} não encontrado`);
    }
    return event;
  }

  async createCategory(nome: string): Promise<Category> {
      const newCategory = this.categoryRepository.create({ nome });
      return this.categoryRepository.save(newCategory);
  }

  async subscribe(eventId: number, userId: number): Promise<{ message: string }> {
    const evento = await this.eventsRepository.findOneBy({ id: eventId });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    const usuario = await this.usersService.findOneById(userId);
    if (!usuario) {
      throw new NotFoundException('Utilizador não encontrado');
    }

    const existingSubscription = await this.inscricaoRepository.findOne({
      where: { evento: { id: eventId }, usuario: { id: userId } },
    });

    if (existingSubscription) {
      throw new BadRequestException('Você já está inscrito neste evento.');
    }

    const novaInscricao = this.inscricaoRepository.create({ evento, usuario });
    await this.inscricaoRepository.save(novaInscricao);

    return { message: 'Inscrição realizada com sucesso!' };
  }
}
