const TYPES = {
  // Services / Adapters
  EnvConfig: Symbol.for('EnvConfig'),
  Logger: Symbol.for('Logger'),
  I18n: Symbol.for('I18n'),

  // Entities
  UserEntity: Symbol.for('UserEntity'),
  UserTokenEntity: Symbol.for('UserTokenEntity'),

  // Services
  PasswordService: Symbol.for('PasswordService'),
  StatelessTokenService: Symbol.for('StatelessTokenService'),
  UserTokenService: Symbol.for('UserTokenService'),
  AuthService: Symbol.for('AuthService'),

  // Adapters
  MailSender: Symbol.for('MailSender'),
  AnalyticsRepository: Symbol.for('AnalyticsRepository'),
  AuditLogRepository: Symbol.for('AuditLogRepository'),
  QueueManager: Symbol.for('QueueManager'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),
  AllergenRepository: Symbol.for('AllergenRepository'),
  DietaryRegimeRepository: Symbol.for('DietaryRegimeRepository'),
  DishRepository: Symbol.for('DishRepository'),
  MenuRepository: Symbol.for('MenuRepository'),
  DeliveryZoneRepository: Symbol.for('DeliveryZoneRepository'),
  OrderRepository: Symbol.for('OrderRepository'),

  // Use Cases - Auth
  LoginUseCase: Symbol.for('LoginUseCase'),
  RegisterUseCase: Symbol.for('RegisterUseCase'),
  RefreshUseCase: Symbol.for('RefreshUseCase'),
  LogoutUseCase: Symbol.for('LogoutUseCase'),
  ResetPasswordUseCase: Symbol.for('ResetPasswordUseCase'),
  ResetPasswordRequestUseCase: Symbol.for('ResetPasswordRequestUseCase'),
  ValidateAccountUseCase: Symbol.for('ValidateAccountUseCase'),
  ResendValidationEmailUseCase: Symbol.for('ResendValidationEmailUseCase'),

  // Use Cases - User
  GetUserUseCase: Symbol.for('GetUserUseCase'),
  UpdateUserUseCase: Symbol.for('UpdateUserUseCase'),

  // Use Cases - Employee
  CreateEmployeeUseCase: Symbol.for('CreateEmployeeUseCase'),
  SetEmployeePasswordUseCase: Symbol.for('SetEmployeePasswordUseCase'),
  DeactivateEmployeeUseCase: Symbol.for('DeactivateEmployeeUseCase'),
  ReactivateEmployeeUseCase: Symbol.for('ReactivateEmployeeUseCase'),
  GetAllEmployeesUseCase: Symbol.for('GetAllEmployeesUseCase'),

  // Use Cases - Allergen
  CreateAllergenUseCase: Symbol.for('CreateAllergenUseCase'),
  UpdateAllergenUseCase: Symbol.for('UpdateAllergenUseCase'),
  DeleteAllergenUseCase: Symbol.for('DeleteAllergenUseCase'),
  GetAllAllergensUseCase: Symbol.for('GetAllAllergensUseCase'),

  // Use Cases - DietaryRegime
  CreateDietaryRegimeUseCase: Symbol.for('CreateDietaryRegimeUseCase'),
  UpdateDietaryRegimeUseCase: Symbol.for('UpdateDietaryRegimeUseCase'),
  DeleteDietaryRegimeUseCase: Symbol.for('DeleteDietaryRegimeUseCase'),
  GetAllDietaryRegimesUseCase: Symbol.for('GetAllDietaryRegimesUseCase'),

  // Use Cases - Dish
  CreateDishUseCase: Symbol.for('CreateDishUseCase'),
  UpdateDishUseCase: Symbol.for('UpdateDishUseCase'),
  DeleteDishUseCase: Symbol.for('DeleteDishUseCase'),
  GetAllDishesUseCase: Symbol.for('GetAllDishesUseCase'),
  GetDishUseCase: Symbol.for('GetDishUseCase'),

  // Use Cases - Menu
  CreateMenuUseCase: Symbol.for('CreateMenuUseCase'),
  UpdateMenuUseCase: Symbol.for('UpdateMenuUseCase'),
  DeleteMenuUseCase: Symbol.for('DeleteMenuUseCase'),
  GetAllMenusUseCase: Symbol.for('GetAllMenusUseCase'),
  GetMenuUseCase: Symbol.for('GetMenuUseCase'),

  // Use Cases - DeliveryZone
  CreateDeliveryZoneUseCase: Symbol.for('CreateDeliveryZoneUseCase'),
  UpdateDeliveryZoneUseCase: Symbol.for('UpdateDeliveryZoneUseCase'),
  DeleteDeliveryZoneUseCase: Symbol.for('DeleteDeliveryZoneUseCase'),
  GetAllDeliveryZonesUseCase: Symbol.for('GetAllDeliveryZonesUseCase'),
  CalculateDeliveryPriceUseCase: Symbol.for('CalculateDeliveryPriceUseCase'),

  // Use Cases - Order
  CreateOrderUseCase: Symbol.for('CreateOrderUseCase'),
  GetUserOrdersUseCase: Symbol.for('GetUserOrdersUseCase'),
  GetOrderUseCase: Symbol.for('GetOrderUseCase'),
  GetAllOrdersUseCase: Symbol.for('GetAllOrdersUseCase'),
  UpdateOrderStatusUseCase: Symbol.for('UpdateOrderStatusUseCase'),
  ApplyMaterialReturnPenaltiesUseCase: Symbol.for('ApplyMaterialReturnPenaltiesUseCase'),

  // Infra
  ClientDatabase: Symbol.for('ClientDatabase'),
  TemplateMailer: Symbol.for('TemplateMailer'),
  MongoClient: Symbol.for('MongoClient'),
  PgBossClient: Symbol.for('PgBossClient'),
};

export { TYPES };
