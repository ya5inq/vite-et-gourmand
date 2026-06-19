export interface ApplyMaterialReturnPenaltiesResultInterface {
  /** Number of orders the penalty was applied to during this run. */
  penalizedCount: number;
}

export interface ApplyMaterialReturnPenaltiesUseCaseInterface {
  executeApplyMaterialReturnPenalties: () => Promise<ApplyMaterialReturnPenaltiesResultInterface>;
}
