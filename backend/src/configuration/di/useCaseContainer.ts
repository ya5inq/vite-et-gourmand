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
import { GetAllOperatingHoursUseCaseInterface } from '@/application/useCases/cms/getAllOperatingHours/getAllOperatingHours.useCase.interface';
import { GetPageContentUseCaseInterface } from '@/application/useCases/cms/getPageContent/getPageContent.useCase.interface';
import { UpsertOperatingHoursUseCaseInterface } from '@/application/useCases/cms/upsertOperatingHours/upsertOperatingHours.useCase.interface';
import { UpsertPageContentUseCaseInterface } from '@/application/useCases/cms/upsertPageContent/upsertPageContent.useCase.interface';
import { DeleteContactMessageUseCaseInterface } from '@/application/useCases/contact/deleteContactMessage/deleteContactMessage.useCase.interface';
import { GetContactMessagesUseCaseInterface } from '@/application/useCases/contact/getContactMessages/getContactMessages.useCase.interface';
import { MarkContactMessageReadUseCaseInterface } from '@/application/useCases/contact/markContactMessageRead/markContactMessageRead.useCase.interface';
import { SendContactMessageUseCaseInterface } from '@/application/useCases/contact/sendContactMessage/sendContactMessage.useCase.interface';
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
import { CreateEmployeeUseCaseInterface } from '@/application/useCases/employee/createEmployee/createEmployee.useCase.interface';
import { DeactivateEmployeeUseCaseInterface } from '@/application/useCases/employee/deactivateEmployee/deactivateEmployee.useCase.interface';
import { GetAllEmployeesUseCaseInterface } from '@/application/useCases/employee/getAllEmployees/getAllEmployees.useCase.interface';
import { ReactivateEmployeeUseCaseInterface } from '@/application/useCases/employee/reactivateEmployee/reactivateEmployee.useCase.interface';
import { SetEmployeePasswordUseCaseInterface } from '@/application/useCases/employee/setEmployeePassword/setEmployeePassword.useCase.interface';
import { CreateMenuUseCaseInterface } from '@/application/useCases/menu/createMenu/createMenu.useCase.interface';
import { DeleteMenuUseCaseInterface } from '@/application/useCases/menu/deleteMenu/deleteMenu.useCase.interface';
import { GetAllMenusUseCaseInterface } from '@/application/useCases/menu/getAllMenus/getAllMenus.useCase.interface';
import { GetMenuUseCaseInterface } from '@/application/useCases/menu/getMenu/getMenu.useCase.interface';
import { UpdateMenuUseCaseInterface } from '@/application/useCases/menu/updateMenu/updateMenu.useCase.interface';
import { ApplyMaterialReturnPenaltiesUseCaseInterface } from '@/application/useCases/order/applyMaterialReturnPenalties/applyMaterialReturnPenalties.useCase.interface';
import { CreateOrderUseCaseInterface } from '@/application/useCases/order/createOrder/createOrder.useCase.interface';
import { GetAllOrdersUseCaseInterface } from '@/application/useCases/order/getAllOrders/getAllOrders.useCase.interface';
import { GetOrderUseCaseInterface } from '@/application/useCases/order/getOrder/getOrder.useCase.interface';
import { GetUserOrdersUseCaseInterface } from '@/application/useCases/order/getUserOrders/getUserOrders.useCase.interface';
import { UpdateOrderStatusUseCaseInterface } from '@/application/useCases/order/updateOrderStatus/updateOrderStatus.useCase.interface';
import { ApproveReviewUseCaseInterface } from '@/application/useCases/review/approveReview/approveReview.useCase.interface';
import { CreateReviewUseCaseInterface } from '@/application/useCases/review/createReview/createReview.useCase.interface';
import { DeleteReviewUseCaseInterface } from '@/application/useCases/review/deleteReview/deleteReview.useCase.interface';
import { GetAllReviewsUseCaseInterface } from '@/application/useCases/review/getAllReviews/getAllReviews.useCase.interface';
import { GetApprovedReviewsUseCaseInterface } from '@/application/useCases/review/getApprovedReviews/getApprovedReviews.useCase.interface';
import { GetMyReviewsUseCaseInterface } from '@/application/useCases/review/getMyReviews/getMyReviews.useCase.interface';
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
import { GetAllOperatingHoursUseCase } from '@/application/useCases/cms/getAllOperatingHours/getAllOperatingHours.useCase';
import { GetPageContentUseCase } from '@/application/useCases/cms/getPageContent/getPageContent.useCase';
import { UpsertOperatingHoursUseCase } from '@/application/useCases/cms/upsertOperatingHours/upsertOperatingHours.useCase';
import { UpsertPageContentUseCase } from '@/application/useCases/cms/upsertPageContent/upsertPageContent.useCase';
import { DeleteContactMessageUseCase } from '@/application/useCases/contact/deleteContactMessage/deleteContactMessage.useCase';
import { GetContactMessagesUseCase } from '@/application/useCases/contact/getContactMessages/getContactMessages.useCase';
import { MarkContactMessageReadUseCase } from '@/application/useCases/contact/markContactMessageRead/markContactMessageRead.useCase';
import { SendContactMessageUseCase } from '@/application/useCases/contact/sendContactMessage/sendContactMessage.useCase';
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
import { CreateEmployeeUseCase } from '@/application/useCases/employee/createEmployee/createEmployee.useCase';
import { DeactivateEmployeeUseCase } from '@/application/useCases/employee/deactivateEmployee/deactivateEmployee.useCase';
import { GetAllEmployeesUseCase } from '@/application/useCases/employee/getAllEmployees/getAllEmployees.useCase';
import { ReactivateEmployeeUseCase } from '@/application/useCases/employee/reactivateEmployee/reactivateEmployee.useCase';
import { SetEmployeePasswordUseCase } from '@/application/useCases/employee/setEmployeePassword/setEmployeePassword.useCase';
import { CreateMenuUseCase } from '@/application/useCases/menu/createMenu/createMenu.useCase';
import { DeleteMenuUseCase } from '@/application/useCases/menu/deleteMenu/deleteMenu.useCase';
import { GetAllMenusUseCase } from '@/application/useCases/menu/getAllMenus/getAllMenus.useCase';
import { GetMenuUseCase } from '@/application/useCases/menu/getMenu/getMenu.useCase';
import { UpdateMenuUseCase } from '@/application/useCases/menu/updateMenu/updateMenu.useCase';
import { ApplyMaterialReturnPenaltiesUseCase } from '@/application/useCases/order/applyMaterialReturnPenalties/applyMaterialReturnPenalties.useCase';
import { CreateOrderUseCase } from '@/application/useCases/order/createOrder/createOrder.useCase';
import { GetAllOrdersUseCase } from '@/application/useCases/order/getAllOrders/getAllOrders.useCase';
import { GetOrderUseCase } from '@/application/useCases/order/getOrder/getOrder.useCase';
import { GetUserOrdersUseCase } from '@/application/useCases/order/getUserOrders/getUserOrders.useCase';
import { UpdateOrderStatusUseCase } from '@/application/useCases/order/updateOrderStatus/updateOrderStatus.useCase';
import { ApproveReviewUseCase } from '@/application/useCases/review/approveReview/approveReview.useCase';
import { CreateReviewUseCase } from '@/application/useCases/review/createReview/createReview.useCase';
import { DeleteReviewUseCase } from '@/application/useCases/review/deleteReview/deleteReview.useCase';
import { GetAllReviewsUseCase } from '@/application/useCases/review/getAllReviews/getAllReviews.useCase';
import { GetApprovedReviewsUseCase } from '@/application/useCases/review/getApprovedReviews/getApprovedReviews.useCase';
import { GetMyReviewsUseCase } from '@/application/useCases/review/getMyReviews/getMyReviews.useCase';
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

  // Employee
  bind<CreateEmployeeUseCaseInterface>(TYPES.CreateEmployeeUseCase).to(CreateEmployeeUseCase);
  bind<SetEmployeePasswordUseCaseInterface>(TYPES.SetEmployeePasswordUseCase).to(SetEmployeePasswordUseCase);
  bind<DeactivateEmployeeUseCaseInterface>(TYPES.DeactivateEmployeeUseCase).to(DeactivateEmployeeUseCase);
  bind<ReactivateEmployeeUseCaseInterface>(TYPES.ReactivateEmployeeUseCase).to(ReactivateEmployeeUseCase);
  bind<GetAllEmployeesUseCaseInterface>(TYPES.GetAllEmployeesUseCase).to(GetAllEmployeesUseCase);

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

  // Order
  bind<CreateOrderUseCaseInterface>(TYPES.CreateOrderUseCase).to(CreateOrderUseCase);
  bind<GetUserOrdersUseCaseInterface>(TYPES.GetUserOrdersUseCase).to(GetUserOrdersUseCase);
  bind<GetOrderUseCaseInterface>(TYPES.GetOrderUseCase).to(GetOrderUseCase);
  bind<GetAllOrdersUseCaseInterface>(TYPES.GetAllOrdersUseCase).to(GetAllOrdersUseCase);
  bind<UpdateOrderStatusUseCaseInterface>(TYPES.UpdateOrderStatusUseCase).to(UpdateOrderStatusUseCase);
  bind<ApplyMaterialReturnPenaltiesUseCaseInterface>(TYPES.ApplyMaterialReturnPenaltiesUseCase).to(
    ApplyMaterialReturnPenaltiesUseCase,
  );

  // Review
  bind<CreateReviewUseCaseInterface>(TYPES.CreateReviewUseCase).to(CreateReviewUseCase);
  bind<GetMyReviewsUseCaseInterface>(TYPES.GetMyReviewsUseCase).to(GetMyReviewsUseCase);
  bind<GetApprovedReviewsUseCaseInterface>(TYPES.GetApprovedReviewsUseCase).to(GetApprovedReviewsUseCase);
  bind<ApproveReviewUseCaseInterface>(TYPES.ApproveReviewUseCase).to(ApproveReviewUseCase);
  bind<GetAllReviewsUseCaseInterface>(TYPES.GetAllReviewsUseCase).to(GetAllReviewsUseCase);
  bind<DeleteReviewUseCaseInterface>(TYPES.DeleteReviewUseCase).to(DeleteReviewUseCase);

  // Contact
  bind<SendContactMessageUseCaseInterface>(TYPES.SendContactMessageUseCase).to(SendContactMessageUseCase);
  bind<GetContactMessagesUseCaseInterface>(TYPES.GetContactMessagesUseCase).to(GetContactMessagesUseCase);
  bind<MarkContactMessageReadUseCaseInterface>(TYPES.MarkContactMessageReadUseCase).to(MarkContactMessageReadUseCase);
  bind<DeleteContactMessageUseCaseInterface>(TYPES.DeleteContactMessageUseCase).to(DeleteContactMessageUseCase);

  // CMS
  bind<GetPageContentUseCaseInterface>(TYPES.GetPageContentUseCase).to(GetPageContentUseCase);
  bind<GetAllOperatingHoursUseCaseInterface>(TYPES.GetAllOperatingHoursUseCase).to(GetAllOperatingHoursUseCase);
  bind<UpsertPageContentUseCaseInterface>(TYPES.UpsertPageContentUseCase).to(UpsertPageContentUseCase);
  bind<UpsertOperatingHoursUseCaseInterface>(TYPES.UpsertOperatingHoursUseCase).to(UpsertOperatingHoursUseCase);
});

export { useCaseContainer };
