export interface DeleteMenuUseCaseInterface {
  executeDeleteMenu: (id: string) => Promise<void>;
}
