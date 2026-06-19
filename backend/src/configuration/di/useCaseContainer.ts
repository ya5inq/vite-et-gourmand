import { ContainerModule, interfaces } from 'inversify';

import { CreateAllergenUseCaseInterface } from '@/application/useCases/allergen/createAllergen/createAllergen.useCase.interface';
import { DeleteAllergenUseCaseInterface } from '@/application/useCases/allergen/deleteAllergen/deleteAllergen.useCase.interface';
import { GetAllAllergensUseCaseInterface } from '@/application/useCases/allergen/getAllAllergens/getAllAllergens.useCase.interface';
import { UpdateAllergenUseCaseInterface } from '@/application/useCases/allergen/updateAllergen/updateAllergen.useCase.interface';
import { LoginUseCaseInterface } from '@/application/useCases/auth/login/login.useCase.interface';
import { LogoutUseCaseInterface } from '@/application/useCases/auth/logout/logout.useCase.interface';
import { RefreshUseCaseInterface } from '@/application/useCases/auth/refresh/refresh.useCase.interface';
import { RegisterUseCaseInterface } from '@/application/useCases/auth/register/register.useCase.interface';
import { ResendValidationEmailUseCaseInterface } from '@/application/useCases/auth/resendValidationEmail/resendValidationEmail.useCase.interface';
import { ResetPasswordUseCaseInterface } from '@/application/useCases/auth/resetPassword/resetPassword.useCase.interface';
import { ValidateAccountUseCaseInterface } from '@/application/useCases/auth/validateAccount/validateAccount.useCase.interface';
import { CalculateDeliveryPriceUseCaseInterface } from '@/application/useCases/deliveryZone/calculateDeliveryPrice/calculateDeliveryPrice.useCase.interface';
import { CreateDeliveryZoneUseCaseInterface } from '@/application/useCases/deliveryZone/createDeliveryZone/createDeliveryZone.useCase.interface';
import { DeleteDeliveryZoneUseCaseInterface } from '@/application/useCases/deliveryZone/deleteDeliveryZone/deleteDeliveryZone.useCase.interface';
import { GetAllDeliveryZonesUseCaseInterface } from '@/application/useCases/deliveryZone/getAllDeliveryZones/getAllDeliveryZones.useCase.interface';
import { UpdateDeliveryZoneUseCaseInterface } from '@/application/useCases/deliveryZone/updateDeliveryZone/updateDeliveryZone.useCase.interface';
import { CreateDietaryRegimeUseCaseInterface } from '@/application/useCases/dietaryRegime/createDietaryRegime/createDietaryRegime.useCase.interface';
import { DeleteDietaryRegimeUseCaseInterface } from '@/application/useCases/dietaryRegime/deleteDietaryRegime/deleteDietaryRegime.useCase.interface';
import { GetAllDietaryRegimesUseCaseInterface } from '@/application/useCases/dietaryRegime/getAllDietaryRegimes/getAllDietaryRegimes.useCase.interface';
import { UpdateDietaryRegimeUseCaseInterface } from '@/application/useCases/dietaryRegime/updateDietaryRegime/updateDietaryRegime.useCase.interface';
import { CreateDishUseCaseInterface } from '@/application/useCases/dish/createDish/createDish.useCase.interface';
import { DeleteDishUseCaseInterface } from '@/application/useCases/dish/deleteDish/deleteDish.useCase.interface';
import { GetAllDishesUseCaseInterface } from '@/application/useCases/dish/getAllDishes/getAllDishes.useCase.interface';
import { GetDishUseCaseInterface } from '@/application/useCases/dish/getDish/getDish.useCase.interface';
import { UpdateDishUseCaseInterface } from '@/application/useCases/dish/updateDish/updateDish.useCase.interface';
import { CreateMenuUseCaseInterface } from '@/application/useCases/menu/createMenu/createMenu.useCase.interface';
import { DeleteMenuUseCaseInterface } from '@/application/useCases/menu/deleteMenu/deleteMenu.useCase.interface';
import { GetAllMenusUseCaseInterface } from '@/application/useCases/menu/getAllMenus/getAllMenus.useCase.interface';
import { GetMenuUseCaseInterface } from '@/application/useCases/menu/getMenu/getMenu.useCase.interface';
import { UpdateMenuUseCaseInterface } from '@/application/useCases/menu/updateMenu/updateMenu.useCase.interface';
import { GetUserUseCaseInterface } from '@/application/useCases/user/getUser/getUser.useCase.interface';
import { UpdateUserUseCaseInterface } from '@/application/useCases/user/updateUser/updateUser.useCase.interface';

import { CreateAllergenUseCase } from '@/application/useCases/allergen/createAllergen/createAllergen.useCase';
import { DeleteAllergenUseCase } from '@/application/useCases/allergen/deleteAllergen/deleteAllergen.useCase';
import { GetAllAllergensUseCase } from '@/application/useCases/allergen/getAllAllergens/getAllAllergens.useCase';
import { UpdateAllergenUseCase } from '@/application/useCases/allergen/updateAllergen/updateAllergen.useCase';
import { LoginUseCase } from '@/application/useCases/auth/login/login.useCase';
import { LogoutUseCase } from '@/application/useCases/auth/logout/logout.useCase';
import { RefreshUseCase } from '@/application/useCases/auth/refresh/refresh.useCase';
import { RegisterUseCase } from '@/application/useCases/auth/register/register.useCase';
import { ResendValidationEmailUseCase } from '@/application/useCases/auth/resendValidationEmail/resendValidationEmail.useCase';
import { ResetPasswordUseCase } from '@/application/useCases/auth/resetPassword/resetPassword.useCase';
import { ValidateAccountUseCase } from '@/application/useCases/auth/validateAccount/validateAccount.useCase';
import { CalculateDeliveryPriceUseCase } from '@/application/useCases/deliveryZone/calculateDeliveryPrice/calculateDeliveryPrice.useCase';
import { CreateDeliveryZoneUseCase } from '@/application/useCases/deliveryZone/createDeliveryZone/createDeliveryZone.useCase';
import { DeleteDeliveryZoneUseCase } from '@/application/useCases/deliveryZone/deleteDeliveryZone/deleteDeliveryZone.useCase';
import { GetAllDeliveryZonesUseCase } from '@/application/useCases/deliveryZone/getAllDeliveryZones/getAllDeliveryZones.useCase';
import { UpdateDeliveryZoneUseCase } from '@/application/useCases/deliveryZone/updateDeliveryZone/updateDeliveryZone.useCase';
import { CreateDietaryRegimeUseCase } from '@/application/useCases/dietaryRegime/createDietaryRegime/createDietaryRegime.useCase';
import { DeleteDietaryRegimeUseCase } from '@/application/useCases/dietaryRegime/deleteDietaryRegime/deleteDietaryRegime.useCase';
import { GetAllDietaryRegimesUseCase } from '@/application/useCases/dietaryRegime/getAllDietaryRegimes/getAllDietaryRegimes.useCase';
import { UpdateDietaryRegimeUseCase } from '@/application/useCases/dietaryRegime/updateDietaryRegime/updateDietaryRegime.useCase';
import { CreateDishUseCase } from '@/application/useCases/dish/createDish/createDish.useCase';
import { DeleteDishUseCase } from '@/application/useCases/dish/deleteDish/deleteDish.useCase';
import { GetAllDishesUseCase } from '@/application/useCases/dish/getAllDishes/getAllDishes.useCase';
import { GetDishUseCase } from '@/application/useCases/dish/getDish/getDish.useCase';
import { UpdateDishUseCase } from '@/application/useCases/dish/updateDish/updateDish.useCase';
import { CreateMenuUseCase } from '@/application/useCases/menu/createMenu/createMenu.useCase';
import { DeleteMenuUseCase } from '@/application/useCases/menu/deleteMenu/deleteMenu.useCase';
import { GetAllMenusUseCase } from '@/application/useCases/menu/getAllMenus/getAllMenus.useCase';
import { GetMenuUseCase } from '@/application/useCases/menu/getMenu/getMenu.useCase';
import { UpdateMenuUseCase } from '@/application/useCases/menu/updateMenu/updateMenu.useCase';
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

  // Allergen
  bind<CreateAllergenUseCaseInterface>(TYPES.CreateAllergenUseCase).to(CreateAllergenUseCase);
  bind<UpdateAllergenUseCaseInterface>(TYPES.UpdateAllergenUseCase).to(UpdateAllergenUseCase);
  bind<DeleteAllergenUseCaseInterface>(TYPES.DeleteAllergenUseCase).to(DeleteAllergenUseCase);
  bind<GetAllAllergensUseCaseInterface>(TYPES.GetAllAllergensUseCase).to(GetAllAllergensUseCase);

  // DietaryRegime
  bind<CreateDietaryRegimeUseCaseInterface>(TYPES.CreateDietaryRegimeUseCase).to(CreateDietaryRegimeUseCase);
  bind<UpdateDietaryRegimeUseCaseInterface>(TYPES.UpdateDietaryRegimeUseCase).to(UpdateDietaryRegimeUseCase);
  bind<DeleteDietaryRegimeUseCaseInterface>(TYPES.DeleteDietaryRegimeUseCase).to(DeleteDietaryRegimeUseCase);
  bind<GetAllDietaryRegimesUseCaseInterface>(TYPES.GetAllDietaryRegimesUseCase).to(GetAllDietaryRegimesUseCase);

  // Dish
  bind<CreateDishUseCaseInterface>(TYPES.CreateDishUseCase).to(CreateDishUseCase);
  bind<UpdateDishUseCaseInterface>(TYPES.UpdateDishUseCase).to(UpdateDishUseCase);
  bind<DeleteDishUseCaseInterface>(TYPES.DeleteDishUseCase).to(DeleteDishUseCase);
  bind<GetAllDishesUseCaseInterface>(TYPES.GetAllDishesUseCase).to(GetAllDishesUseCase);
  bind<GetDishUseCaseInterface>(TYPES.GetDishUseCase).to(GetDishUseCase);

  // Menu
  bind<CreateMenuUseCaseInterface>(TYPES.CreateMenuUseCase).to(CreateMenuUseCase);
  bind<UpdateMenuUseCaseInterface>(TYPES.UpdateMenuUseCase).to(UpdateMenuUseCase);
  bind<DeleteMenuUseCaseInterface>(TYPES.DeleteMenuUseCase).to(DeleteMenuUseCase);
  bind<GetAllMenusUseCaseInterface>(TYPES.GetAllMenusUseCase).to(GetAllMenusUseCase);
  bind<GetMenuUseCaseInterface>(TYPES.GetMenuUseCase).to(GetMenuUseCase);

  // DeliveryZone
  bind<CreateDeliveryZoneUseCaseInterface>(TYPES.CreateDeliveryZoneUseCase).to(CreateDeliveryZoneUseCase);
  bind<UpdateDeliveryZoneUseCaseInterface>(TYPES.UpdateDeliveryZoneUseCase).to(UpdateDeliveryZoneUseCase);
  bind<DeleteDeliveryZoneUseCaseInterface>(TYPES.DeleteDeliveryZoneUseCase).to(DeleteDeliveryZoneUseCase);
  bind<GetAllDeliveryZonesUseCaseInterface>(TYPES.GetAllDeliveryZonesUseCase).to(GetAllDeliveryZonesUseCase);
  bind<CalculateDeliveryPriceUseCaseInterface>(TYPES.CalculateDeliveryPriceUseCase).to(CalculateDeliveryPriceUseCase);
});

export { useCaseContainer };
