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

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  UserTokenRepository: Symbol.for('UserTokenRepository'),

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

  // Infra
  ClientDatabase: Symbol.for('ClientDatabase'),
  TemplateMailer: Symbol.for('TemplateMailer'),
  MongoClient: Symbol.for('MongoClient'),
};

export { TYPES };
