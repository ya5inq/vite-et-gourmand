export interface DeleteDietaryRegimeUseCaseInterface {
  executeDeleteDietaryRegime: (id: string) => Promise<void>;
}
