import { z } from "zod";

/**
 * Validates a Nigerian phone number.
 * Accepts formats: 08012345678, +2348012345678, 2348012345678
 */
const nigerianPhone = z
  .string()
  .min(1, "Phone number is required")
  .regex(
    /^(\+?234|0)[789][01]\d{8}$/,
    "Please enter a valid Nigerian phone number (e.g. 08012345678)"
  );

/**
 * Schema for creating a new property inquiry.
 */
export const InquirySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255, "Email must not exceed 255 characters")
    .toLowerCase()
    .trim(),
  phone: nigerianPhone.optional().or(z.literal("")),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must not exceed 2000 characters")
    .trim(),
  propertyId: z.string().cuid("Invalid property ID"),
});

export type InquiryInput = z.infer<typeof InquirySchema>;

/**
 * Schema for a viewing request.
 */
export const ViewingRequestSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(255)
    .toLowerCase()
    .trim(),
  phone: nigerianPhone,
  message: z
    .string()
    .max(1000, "Message must not exceed 1000 characters")
    .trim()
    .optional(),
  preferredDate: z
    .string()
    .min(1, "Please select a preferred date")
    .refine((val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    }, "Preferred date must be today or in the future"),
  preferredTime: z
    .string()
    .min(1, "Please select a preferred time slot"),
  propertyId: z.string().cuid("Invalid property ID"),
});

export type ViewingRequestInput = z.infer<typeof ViewingRequestSchema>;
