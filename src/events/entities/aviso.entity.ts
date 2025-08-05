import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { Event } from './event.entity';

@Entity('avisos')
export class Aviso {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  mensagem: string;

  @CreateDateColumn()
  data_criacao: Date;

  @ManyToOne(() => User, { eager: true })
  autor: User;

  @ManyToOne(() => Event, event => event.avisos)
  evento: Event;
}