const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_HISTORY_COUNT = 5;
const PASSWORD_EXPIRY_DAYS = 90;
const PASSWORD_EXPIRY_WARNING_DAYS = 7;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

function validatePasswordPolicy(password) {
  const errors = [];

  if (!password) {
    errors.push("Password is required.");
    return errors;
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`
    );
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/~`'+;=]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  }

  return errors;
}

function calculatePasswordExpiry(date = new Date()) {
  const expiry = new Date(date);
  expiry.setDate(expiry.getDate() + PASSWORD_EXPIRY_DAYS);

  return expiry;
}

function isPasswordExpired(passwordExpiresAt) {
  if (!passwordExpiresAt) {
    return false;
  }

  return new Date() >= new Date(passwordExpiresAt);
}

function getPasswordExpiryWarning(passwordExpiresAt) {
  if (!passwordExpiresAt) {
    return null;
  }

  const now = new Date();
  const expiry = new Date(passwordExpiresAt);

  const difference = expiry.getTime() - now.getTime();

  const daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (
    daysRemaining >= 0 &&
    daysRemaining <= PASSWORD_EXPIRY_WARNING_DAYS
  ) {
    return daysRemaining;
  }

  return null;
}

module.exports = {
  PASSWORD_MIN_LENGTH,
  PASSWORD_HISTORY_COUNT,
  PASSWORD_EXPIRY_DAYS,
  PASSWORD_EXPIRY_WARNING_DAYS,
  MAX_LOGIN_ATTEMPTS,
  LOCKOUT_MINUTES,
  validatePasswordPolicy,
  calculatePasswordExpiry,
  isPasswordExpired,
  getPasswordExpiryWarning,
};