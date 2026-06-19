export interface SetEmployeePasswordInputInterface {
  tokenValue: string;
  newPassword: string;
}

export interface SetEmployeePasswordUseCaseInterface {
  executeSetEmployeePassword(input: SetEmployeePasswordInputInterface): Promise<void>;
}
