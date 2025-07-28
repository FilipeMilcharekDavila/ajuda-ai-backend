import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Event } from './event.entity';

@Entity('categorias')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nome: string;

  @OneToMany(() => Event, event => event.categoria)
  eventos: Event[];
}