import { UserTokenInterface } from '../userToken/userToken.entity.interface';

export enum RoleType {
  USER = 'USER',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN',
}

/**
 * Returns true when the given role is a staff role (employee or admin).
 */
export const isStaffRole = (role: RoleType): boolean => role === RoleType.EMPLOYEE || role === RoleType.ADMIN;

/**
 * Returns true when the given role is the admin role.
 */
export const isAdminRole = (role: RoleType): boolean => role === RoleType.ADMIN;

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  role: RoleType;
  /**
   * Derived from `role === RoleType.ADMIN`. Kept on the entity/JWT to stay
   * compatible with the authorization middleware.
   */
  admin: boolean;
  firstName: string;
  lastName: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  /** Allows disabling an account (e.g. a deactivated employee). */
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt: Date | null;
  preferredLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  userTokens: UserTokenInterface[];
}
