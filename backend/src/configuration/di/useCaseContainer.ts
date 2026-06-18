import { ContainerModule, interfaces } from 'inversify';

import { LoginUseCaseInterface } from '@/application/useCases/auth/login/login.useCase.interface';
import { LogoutUseCaseInterface } from '@/application/useCases/auth/logout/logout.useCase.interface';
import { RefreshUseCaseInterface } from '@/application/useCases/auth/refresh/refresh.useCase.interface';
import { RegisterUseCaseInterface } from '@/application/useCases/auth/register/register.useCase.interface';
import { ResendValidationEmailUseCaseInterface } from '@/application/useCases/auth/resendValidationEmail/resendValidationEmail.useCase.interface';
import { ResetPasswordUseCaseInterface } from '@/application/useCases/auth/resetPassword/resetPassword.useCase.interface';
import { ValidateAccountUseCaseInterface } from '@/application/useCases/auth/validateAccount/validateAccount.useCase.interface';
import { GetUserUseCaseInterface } from '@/application/useCases/user/getUser/getUser.useCase.interface';
import { UpdateUserUseCaseInterface } from '@/application/useCases/user/updateUser/updateUser.useCase.interface';

import { LoginUseCase } from '@/application/useCases/auth/login/login.useCase';
import { LogoutUseCase } from '@/application/useCases/auth/logout/logout.useCase';
import { RefreshUseCase } from '@/application/useCases/auth/refresh/refresh.useCase';
import { RegisterUseCase } from '@/application/useCases/auth/register/register.useCase';
import { ResendValidationEmailUseCase } from '@/application/useCases/auth/resendValidationEmail/resendValidationEmail.useCase';
import { ResetPasswordUseCase } from '@/application/useCases/auth/resetPassword/resetPassword.useCase';
import { ValidateAccountUseCase } from '@/application/useCases/auth/validateAccount/validateAccount.useCase';
import { GetUserUseCase } from '@/application/useCases/user/getUser/getUser.useCase';
import { UpdateUserUseCase } from '@/application/useCases/user/updateUser/updateUser.useCase';

import { TYPES } from './types';

const useCaseContainer = new ContainerModule((bind: interfaces.Bind) => {
  // Auth
  bind<LoginUseCaseInterface>(TYPES.LoginUseCase).to(LoginUseCase);
  bind<RegisterUseCaseInterface>(TYPES.RegisterUseCase).to(RegisterUseCase);
  bind<RefreshUseCaseInterface>(TYPES.RefreshUseCase).to(RefreshUseCase);
  bind<LogoutUseCaseInterface>(TYPES.LogoutUseCase).to(LogoutUseCase);
  // ResetPassword handles both the request and the actual reset; bound to both symbols.
  bind<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordUseCase).to(ResetPasswordUseCase);
  bind<ResetPasswordUseCaseInterface>(TYPES.ResetPasswordRequestUseCase).to(ResetPasswordUseCase);
  bind<ValidateAccountUseCaseInterface>(TYPES.ValidateAccountUseCase).to(ValidateAccountUseCase);
  bind<ResendValidationEmailUseCaseInterface>(TYPES.ResendValidationEmailUseCase).to(ResendValidationEmailUseCase);

  // User
  bind<GetUserUseCaseInterface>(TYPES.GetUserUseCase).to(GetUserUseCase);
  bind<UpdateUserUseCaseInterface>(TYPES.UpdateUserUseCase).to(UpdateUserUseCase);
});

export { useCaseContainer };
