export interface DeleteContactMessageUseCaseInterface {
  executeDeleteContactMessage: (messageId: string) => Promise<void>;
}
