import { z } from "zod";

const PROPERTY_TYPES = [
  "APARTMENT",
  "FLAT",
  "STUDIO",
  "DUPLEX",
  "BUNGALOW",
  "PENTHOUSE",
  "TERRACED_HOUSE",
  "DETACHED_HOUSE",
  "SEMI_DETACHED",
  "MANSION",
] as const;

const RENTAL_PERIODS = [
  "MONTHLY",
  "QUARTERLY",
  "BI_ANNUALLY",
  "ANNUALLY",
] as const;

const FURNISHED_STATUSES = [
  "FURNISHED",
  "SEMI_FURNISHED",
  "UNFURNISHED",
] as const;

const AVAILABILITY_STATUSES = [
  "AVAILABLE",
  "UNAVAILABLE",
  "RENTED",
  "COMING_SOON",
] as const;

export const PropertySchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(200, "Title must not exceed 200 characters")
    .trim(),
  description: z
    .string()
    .min(50, "Description must be at least 50 characters")
    .max(5000, "Description must not exceed 5000 characters")
    .trim(),
  price: z
    .number()
    .min(1, "Price must be greater than 0")
    .max(1_000_000_000, "Price is too high"),
  rentalPeriod: z.enum(RENTAL_PERIODS),
  propertyType: z.enum(PROPERTY_TYPES),
  bedrooms: z
    .number()
    .int("Bedrooms must be a whole number")
    .min(0, "Bedrooms cannot be negative")
    .max(20),
  bathrooms: z
    .number()
    .int("Bathrooms must be a whole number")
    .min(1, "Must have at least 1 bathroom")
    .max(20),
  toilets: z.number().int().min(0).max(20).optional(),
  sizeSqm: z.number().min(1).max(100_000).optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must not exceed 500 characters")
    .trim(),
  nearestLandmark: z.string().max(200).trim().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES),
  furnishedStatus: z.enum(FURNISHED_STATUSES),
  parkingSpaces: z.number().int().min(0).max(20).default(0),
  floor: z.number().int().min(0).max(200).optional(),
  totalFloors: z.number().int().min(1).max(200).optional(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),
  serviceCharge: z.number().min(0).optional(),
  cautionFee: z.number().min(0).optional(),
  agencyFee: z.number().min(0).optional(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(true),
  locationId: z.string().cuid("Invalid location ID"),
  amenityIds: z.array(z.string().cuid()).default([]),
});

export type PropertyInput = z.infer<typeof PropertySchema>;

/**
 * Search/filter query parameters schema (all optional).
 */
export const PropertySearchSchema = z.object({
  q: z.string().max(200).trim().optional(),
  location: z.string().max(100).optional(),
  propertyType: z.enum(PROPERTY_TYPES).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(1).optional(),
  furnishedStatus: z.enum(FURNISHED_STATUSES).optional(),
  availabilityStatus: z.enum(AVAILABILITY_STATUSES).optional(),
  sort: z.enum(["newest", "oldest", "price_asc", "price_desc"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export type PropertySearchInput = z.infer<typeof PropertySearchSchema>;
