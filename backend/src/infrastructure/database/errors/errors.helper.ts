interface DatabaseErrorInterface {
  code: string;
  constraint: string;
}

export const isDatabaseError = (error: unknown): error is DatabaseErrorInterface => {
  return typeof error === 'object' && error !== null && 'code' in error && 'constraint' in error;
};

export const isDatabaseUniqueConstraintError = (error: unknown, constraintPrefix: string): boolean => {
  if (isDatabaseError(error)) {
    return error.code === '23505' && error.constraint.startsWith(constraintPrefix);
  }
  return false;
};
