import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { Category } from './category.entity';
import { Inscricao } from './inscricao.entity';

@Entity('eventos')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Inscricao, inscricao => inscricao.evento)
  inscricoes: Inscricao[];

  @Column()
  titulo: string;

  @Column('text')
  descricao: string;

  @Column()
  localizacao: string;

  @Column()
  data_evento: Date;

  @Column({ nullable: true })
  imagem_url: string;

  @CreateDateColumn()
  data_criacao: Date;

  @ManyToOne(() => User, { eager: true })
  organizador: User;

  @ManyToOne(() => Category, { eager: true })
  categoria: Category;
}