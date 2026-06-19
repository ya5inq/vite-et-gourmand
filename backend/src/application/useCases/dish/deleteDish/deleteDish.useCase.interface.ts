export interface DeleteDishUseCaseInterface {
  executeDeleteDish: (id: string) => Promise<void>;
}
