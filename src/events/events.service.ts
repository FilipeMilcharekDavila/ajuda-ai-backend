import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { User } from '../users/user.entity';
import { Category } from './entities/category.entity';
import { UsersService } from '../users/users.service';
import { Inscricao } from './entities/inscricao.entity';
import { Aviso } from './entities/aviso.entity';
import { CreateAvisoDto } from './dto/create-aviso.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event) private eventsRepository: Repository<Event>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(Inscricao) private inscricaoRepository: Repository<Inscricao>,
    @InjectRepository(Aviso) private avisoRepository: Repository<Aviso>,
    private readonly usersService: UsersService,
  ) {}

  async create(createEventDto: CreateEventDto, requestingUser: { userId: number }): Promise<Event> {
    const organizador = await this.usersService.findOneById(requestingUser.userId);
    if (!organizador) {
      throw new NotFoundException('Utilizador organizador não encontrado.');
    }

    const { categoriaId, ...eventData } = createEventDto;
    const categoria = await this.categoryRepository.findOne({ where: { id: categoriaId } });
    if (!categoria) {
      throw new BadRequestException(`Categoria com ID #${categoriaId} não encontrada.`);
    }

    const event = this.eventsRepository.create({
      ...eventData,
      organizador: organizador,
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

  async update(id: number, updateEventDto: UpdateEventDto, user: { userId: number }): Promise<Event> {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['organizador'] });
    if (!event) {
      throw new NotFoundException(`Evento com ID #${id} não encontrado.`);
    }
    if (event.organizador.id !== user.userId) {
      throw new ForbiddenException('Apenas o organizador pode editar este evento.');
    }

    if (updateEventDto.categoriaId) {
        const categoria = await this.categoryRepository.findOneBy({ id: updateEventDto.categoriaId });
        if (!categoria) throw new BadRequestException(`Categoria com ID #${updateEventDto.categoriaId} não encontrada.`);
        event.categoria = categoria;
    }

    const { categoriaId, ...eventData } = updateEventDto;
    Object.assign(event, eventData);

    return this.eventsRepository.save(event);
  }

  async remove(id: number, user: { userId: number }): Promise<{ message: string }> {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['organizador'] });
    if (!event) {
      throw new NotFoundException(`Evento com ID #${id} não encontrado.`);
    }
    if (event.organizador.id !== user.userId) {
      throw new ForbiddenException('Apenas o organizador pode excluir este evento.');
    }
    await this.eventsRepository.remove(event);
    return { message: 'Evento excluído com sucesso!' };
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

  async createAviso(eventId: number, createAvisoDto: CreateAvisoDto, user: { userId: number }): Promise<Aviso> {
    const evento = await this.eventsRepository.findOne({ where: { id: eventId }, relations: ['organizador'] });
    if (!evento) {
      throw new NotFoundException('Evento não encontrado');
    }

    if (evento.organizador.id !== user.userId) {
        throw new ForbiddenException('Apenas o organizador do evento pode postar avisos.');
    }

    const autor = await this.usersService.findOneById(user.userId);
    if (!autor) {
      throw new NotFoundException('Autor não encontrado');
    }

    const novoAviso = this.avisoRepository.create({
      mensagem: createAvisoDto.mensagem,
      evento: evento,
      autor: autor,
    });
    return this.avisoRepository.save(novoAviso);
  }

  async findAvisosByEventId(eventId: number): Promise<Aviso[]> {
    return this.avisoRepository.find({
      where: { evento: { id: eventId } },
      order: { data_criacao: 'DESC' },
    });
  }

  async deleteAviso(avisoId: number, user: { userId: number }): Promise<{ message: string }> {
    const aviso = await this.avisoRepository.findOne({
      where: { id: avisoId },
      relations: ['evento', 'evento.organizador'],
    });

    if (!aviso) {
      throw new NotFoundException('Aviso não encontrado.');
    }

    if (aviso.evento.organizador.id !== user.userId) {
      throw new ForbiddenException('Apenas o organizador do evento pode excluir avisos.');
    }

    await this.avisoRepository.remove(aviso);
    return { message: 'Aviso excluído com sucesso!' };
  }
}
