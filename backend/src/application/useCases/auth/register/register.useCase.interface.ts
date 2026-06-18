export interface RegisterInputInterface {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
}

export interface RegisterUseCaseInterface {
  executeRegister(input: RegisterInputInterface): Promise<void>;
}
