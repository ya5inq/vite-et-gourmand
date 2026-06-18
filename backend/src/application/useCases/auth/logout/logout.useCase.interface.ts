export interface LogoutUseCaseInterface {
  executeLogout: (refreshTokenValue?: string) => Promise<void>;
}
