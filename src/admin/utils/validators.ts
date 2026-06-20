/**
 * Data Validation Utilities
 * Validate user input and data integrity
 */

export const validators = {
  email: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  phone: (phone: string): boolean => {
    const phoneRegex = /^\+?27\d{9}$|^\d{10}$/;
    return phoneRegex.test(phone);
  },

  idNumber: (idNumber: string): boolean => {
    // South African ID number validation (simplified)
    return /^\d{13}$/.test(idNumber);
  },

  practiceNumber: (practiceNumber: string): boolean => {
    // HPCSA practice number validation (simplified)
    return /^[A-Z]{2}\d{6}$/.test(practiceNumber);
  },

  dateTime: (dateTime: string): boolean => {
    const date = new Date(dateTime);
    return !isNaN(date.getTime());
  },

  futureDate: (dateTime: string): boolean => {
    const date = new Date(dateTime);
    return date > new Date();
  },

  positiveNumber: (value: number): boolean => {
    return value > 0 && Number.isFinite(value);
  },

  positiveCents: (cents: number): boolean => {
    return Number.isInteger(cents) && cents > 0;
  },

  percentageValue: (value: number): boolean => {
    return value >= 0 && value <= 100;
  },

  required: (value: unknown): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },

  minLength: (value: string, minLength: number): boolean => {
    return value.length >= minLength;
  },

  maxLength: (value: string, maxLength: number): boolean => {
    return value.length <= maxLength;
  },

  urlFormat: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  jsonFormat: (json: string): boolean => {
    try {
      JSON.parse(json);
      return true;
    } catch {
      return false;
    }
  },
};

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateAppointmentFields = (data: {
  appointment_datetime: string;
  duration_minutes: number;
  venue: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!validators.futureDate(data.appointment_datetime)) {
    errors.push('Appointment date must be in the future');
  }

  if (!validators.positiveNumber(data.duration_minutes)) {
    errors.push('Duration must be a positive number');
  }

  if (!validators.required(data.venue)) {
    errors.push('Venue is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateInvoiceFields = (data: {
  amount_cents: number;
  due_date: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!validators.positiveCents(data.amount_cents)) {
    errors.push('Amount must be a positive integer in cents');
  }

  if (!validators.futureDate(data.due_date)) {
    errors.push('Due date must be in the future');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
