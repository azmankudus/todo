/**
 * Password Complexity Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 */
export const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const PASSWORD_COMPLEXITY_MESSAGE = "Min 8 characters\n1 uppercase\n1 lowercase\n1 number\n1 special Symbol";

import { RESOURCES } from "../config/resources";

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const EMAIL_HINT = RESOURCES.PLACEHOLDERS.EMAIL;

export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validatePasswordComplexity = (password: string): boolean => {
  return PASSWORD_COMPLEXITY_REGEX.test(password);
};
