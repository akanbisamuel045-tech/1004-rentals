/**
 * TypeScript types for Property-related data.
 * These mirror the Prisma models but are safe for client-side use.
 */

export type PropertyType =
  | "APARTMENT"
  | "FLAT"
  | "STUDIO"
  | "DUPLEX"
  | "BUNGALOW"
  | "PENTHOUSE"
  | "TERRACED_HOUSE"
  | "DETACHED_HOUSE"
  | "SEMI_DETACHED"
  | "MANSION";

export type RentalPeriod =
  | "MONTHLY"
  | "QUARTERLY"
  | "BI_ANNUALLY"
  | "ANNUALLY";

export type FurnishedStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";

export type AvailabilityStatus =
  | "AVAILABLE"
  | "UNAVAILABLE"
  | "RENTED"
  | "COMING_SOON";

export interface PropertyImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isPrimary: boolean;
  publicId: string | null;
}

export interface Amenity {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  category: string | null;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  area: string;
  city: string;
  state: string;
  description: string | null;
  imageUrl: string | null;
  isPopular: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: string; // Prisma Decimal serialized as string
  rentalPeriod: RentalPeriod;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  toilets: number | null;
  sizeSqm: string | null; // Prisma Decimal serialized as string
  address: string;
  nearestLandmark: string | null;
  latitude: string | null;
  longitude: string | null;
  availabilityStatus: AvailabilityStatus;
  furnishedStatus: FurnishedStatus;
  parkingSpaces: number;
  floor: number | null;
  totalFloors: number | null;
  yearBuilt: number | null;
  serviceCharge: string | null;
  cautionFee: string | null;
  agencyFee: string | null;
  isFeatured: boolean;
  isPublished: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  locationId: string;
  location: Location;
  images: PropertyImage[];
  amenities?: Amenity[];
}

/**
 * Lighter version of Property used in listing/card views.
 * Omits heavy fields like description.
 */
export interface PropertySummary {
  id: string;
  title: string;
  price: string;
  rentalPeriod: RentalPeriod;
  propertyType: PropertyType;
  bedrooms: number;
  bathrooms: number;
  sizeSqm: string | null;
  availabilityStatus: AvailabilityStatus;
  furnishedStatus: FurnishedStatus;
  isFeatured: boolean;
  createdAt: string;
  location: Pick<Location, "id" | "name" | "slug" | "area" | "city">;
  images: Pick<PropertyImage, "id" | "url" | "alt" | "isPrimary">[];
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  APARTMENT: "Apartment",
  FLAT: "Flat",
  STUDIO: "Studio",
  DUPLEX: "Duplex",
  BUNGALOW: "Bungalow",
  PENTHOUSE: "Penthouse",
  TERRACED_HOUSE: "Terraced House",
  DETACHED_HOUSE: "Detached House",
  SEMI_DETACHED: "Semi-Detached",
  MANSION: "Mansion",
};

export const RENTAL_PERIOD_LABELS: Record<RentalPeriod, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  BI_ANNUALLY: "Bi-annually",
  ANNUALLY: "Annually",
};

export const FURNISHED_STATUS_LABELS: Record<FurnishedStatus, string> = {
  FURNISHED: "Furnished",
  SEMI_FURNISHED: "Semi-Furnished",
  UNFURNISHED: "Unfurnished",
};

export const AVAILABILITY_STATUS_LABELS: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Available",
  UNAVAILABLE: "Unavailable",
  RENTED: "Rented",
  COMING_SOON: "Coming Soon",
};
