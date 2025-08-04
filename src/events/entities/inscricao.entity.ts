import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';
import { Event } from './event.entity';

@Entity('inscricoes')
export class Inscricao {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.inscricoes)
  usuario: User;

  @ManyToOne(() => Event, event => event.inscricoes)
  evento: Event;

  @CreateDateColumn()
  data_inscricao: Date;
}