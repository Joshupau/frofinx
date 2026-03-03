import { z } from "zod";

export const registerSchema = z.object({
  username: z.string()
    .min(5, 'Minimum of 5 characters for username! Please try again.')
    .max(40, 'Maximum of 40 characters for username! Please try again.')
    .regex(/^[a-zA-Z0-9]+$/, "Please don't use special characters for username! Please try again."),
  password: z.string()
    .min(5, 'Minimum of 5 characters for password! Please try again.')
    .max(20, 'Maximum of 20 characters for password! Please try again.')
    .regex(/^[a-z0-9]+$/, "Please use lowercase letters and numbers only for username."),
  // optional user details
  phonenumber: z.string()
    .length(11, 'Please enter your right phone number! 11 numbers are needed to be entered.')
    .regex(/^[0-9]+$/, 'Please input a valid phone number and try again.')
    .optional(),
  email: z.string()
    .email('Please enter a valid email address! Please try again.')
    .optional()
    .refine((email) => {
      if (!email) return true;
        const domain = email.split('@')[1];
        return domain === 'gmail.com' || domain === 'yahoo.com' || domain === 'outlook.com';
    }, 'Email domain must be gmail.com, yahoo.com, or outlook.com! Please try again.'),
  confirmPassword: z.string()
    .min(5, 'Minimum of 5 characters for confirm password! Please try again.')
    .max(20, 'Maximum of 20 characters for confirm password! Please try again.')
    .regex(/^[a-z0-9]+$/, "Please use lowercase letters and numbers only for confirm password.")
    .optional(),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  postalcode: z.string().optional(),
});



export type RegisterFormData = z.infer<typeof registerSchema>;