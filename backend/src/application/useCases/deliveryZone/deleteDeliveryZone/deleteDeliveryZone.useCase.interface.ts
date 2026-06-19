export interface DeleteDeliveryZoneUseCaseInterface {
  executeDeleteDeliveryZone: (id: string) => Promise<void>;
}
