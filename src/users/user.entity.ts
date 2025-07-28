import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum UserType {
  VOLUNTARIO = 'voluntario',
  ORGANIZADOR = 'organizador',
}

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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
