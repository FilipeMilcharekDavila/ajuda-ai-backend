import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity';
import { Category } from './category.entity';
import { Inscricao } from './inscricao.entity';
import { Aviso } from './aviso.entity';

@Entity('eventos')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

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

  @OneToMany(() => Inscricao, inscricao => inscricao.evento)
  inscricoes: Inscricao[];

  @OneToMany(() => Aviso, aviso => aviso.evento, { eager: true, cascade: true })
  avisos: Aviso[];
}