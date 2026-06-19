export interface DeleteAllergenUseCaseInterface {
  executeDeleteAllergen: (id: string) => Promise<void>;
}
