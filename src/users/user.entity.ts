import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany
} from 'typeorm';
import { Inscricao } from '../events/entities/inscricao.entity';

export enum UserType {
  VOLUNTARIO = 'voluntario',
  ORGANIZADOR = 'organizador',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Inscricao, inscricao => inscricao.usuario)
  inscricoes: Inscricao[];

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column()
  senha_hash: string;

  @Column({
    type: 'enum',
    enum: UserType,
    default: UserType.VOLUNTARIO,
  })
  tipo: UserType;

  @CreateDateColumn()
  data_criacao: Date;
}
