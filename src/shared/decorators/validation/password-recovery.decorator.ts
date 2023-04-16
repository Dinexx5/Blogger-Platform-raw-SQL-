import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../../entities/users/users.repository';

@ValidatorConstraint({ name: 'recoveryCode', async: true })
@Injectable()
export class IsRecoveryCodeCorrect implements ValidatorConstraintInterface {
  constructor(protected usersRepository: UsersRepository) {}
  async validate(code: string, args: ValidationArguments) {
    const user = await this.usersRepository.findUserByRecoveryCode(code);
    const recoveryInfo = await this.usersRepository.findPasswordRecoveryInfo(user.id);
    if (!user) {
      return false;
    }
    if (!recoveryInfo.expirationDate) {
      return false;
    }
    if (recoveryInfo.recoveryCode !== code) {
      return false;
    }
    if (recoveryInfo.expirationDate < new Date()) {
      return false;
    }
    return true;
  }
  defaultMessage(args: ValidationArguments) {
    return `confirmation code expired, incorrect or email is already confirmed`;
  }
}

export function IsRecoveryCodeValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'recoveryCode',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsRecoveryCodeCorrect,
    });
  };
}
