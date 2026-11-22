import {
  PASSWORD_MIN_LENGTH,
  SIGN_IN_ERRORS,
  USERNAME_MIN_LENGTH,
} from '@/features/auth/constants';

export const usernameRules = {
  required: SIGN_IN_ERRORS.usernameRequired,
  minLength: {
    value: USERNAME_MIN_LENGTH,
    message: SIGN_IN_ERRORS.usernameMinLength,
  },
};

export const passwordRules = {
  required: SIGN_IN_ERRORS.passwordRequired,
  minLength: {
    value: PASSWORD_MIN_LENGTH,
    message: SIGN_IN_ERRORS.passwordMinLength,
  },
  pattern: {
    value: /[a-zA-Z]/,
    message: SIGN_IN_ERRORS.passwordLetter,
  },
};
