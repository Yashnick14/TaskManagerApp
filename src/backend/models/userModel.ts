export interface RegisterFormInputs {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Optional: validation regex constants
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^\+94\d{9}$/;
