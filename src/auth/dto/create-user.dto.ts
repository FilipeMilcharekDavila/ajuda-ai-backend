import { UserType } from '../../users/user.entity';

export class CreateUserDto {
  nome: string;
  email: string;
  password: string;
  tipo: UserType;
}