import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { UserType } from '../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    console.log('--- RolesGuard foi instanciada pelo Nest.js ---');
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    console.log('--- Depurando RolesGuard ---');
    console.log('Utilizador recebido do token:', user);
    console.log('Permissões necessárias para a rota:', requiredRoles);
    const hasPermission = requiredRoles.some((role) => user?.tipo === role);
    console.log('O utilizador tem permissão?', hasPermission);
    console.log('--------------------------');

    if (!user) {
        return false;
    }

    return hasPermission;
  }
}