import {
  propertyOptions,
  amenitiesOptions,
  furnishedStatusOptions,
  listingTypeOptions,
} from "@/data/ListingOptions";
import { z } from "zod";

const validateChoosenOption = (value, options) => {
  return options.some((option) => option === value);
};
//Schema for checking if a valid option is choosen from list of provided options
const optionSchema = (options) =>
  z.string().refine((values) => validateChoosenOption(values, options), {
    message: "The chosen option is not valid.",
  });

//validates if a string is number between min and max (inclusive of main and max)
const validNumberSchema = (min, max = Infinity, message = null) => {
  if (message === null) {
    message = `Must be a valid integer between ${min} - ${max}.`;
  }
  return z.string().refine(
    (val) => {
      const num = Number(val);
      return val !== "" && (num || num === 0) && num >= min && num <= max;
    },
    { message: message }
  );
};

const validDateSchema = () =>
  z.string().refine(
    (date) => {
      const dateObj = new Date(date);
      return !isNaN(dateObj.getTime());
    },
    { message: "Please provide a valid Date." }
  );

const phoneNumberSchema = z.string().refine(
  (value) => {
    // Regular expression to match common phone number formats
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(value);
  },
  {
    message: "Invalid phone number format",
  }
);

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const imageFileSchema = () =>
  z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    );

const PropertyListingSchema = z.object({
  property_title: z
    .string()
    .min(5, { message: "Title must be more than 5 characters" }),
  property_description: z
    .string()
    .min(30, { message: "Description must have atleast 30 characters." })
    .refine((str) => str != null && str != undefined && str != ""),
  listing_type: optionSchema(listingTypeOptions),
  property_type: optionSchema(propertyOptions),
  amenities: z
    .array(optionSchema(amenitiesOptions), { message: "Choose valid amenites" })
    .min(1, { message: "Must have atleast one amenities." }),
  furnished_status: optionSchema(furnishedStatusOptions),
  bathrooms: validNumberSchema(0, 10),
  bedrooms: validNumberSchema(0, 15),
  halls: validNumberSchema(0, 3),
  construction_date: validDateSchema(),
  location: z.object(
    {
      coordinates: z.array().refine((coords) => coords.length == 2),
      address: z.object(),
    },
    { message: "Please provide your loction" }
  ),
  media: z.object(
    {
      thumbnail: imageFileSchema(),
      images: z.array(imageFileSchema()).refine((arr) => arr.length > 0, {
        message: "Must Provide 2 images thumbnail + 1.",
      }),
    },
    { message: "Please provide thumbnail and images." }
  ),
  area: validNumberSchema(50, Infinity, "Area must be greater than 50 sqft."),
  phone: phoneNumberSchema,
  price: validNumberSchema(100, Infinity, "Price must be greater than 100 Rs."),
});

const stepSchemas = {
  basicDetails: z.object({
    property_title: z
      .string()
      .min(5, { message: "Title must be more than 5 characters" }),
    listing_type: optionSchema(listingTypeOptions),
    property_type: optionSchema(propertyOptions),
    amenities: z
      .array(optionSchema(amenitiesOptions), {
        message: "Choose valid amenites",
      })
      .min(1, { message: "Must have atleast one amenities." }),
    furnished_status: optionSchema(furnishedStatusOptions),
    bathrooms: validNumberSchema(0, 10),
    bedrooms: validNumberSchema(0, 15),
    halls: validNumberSchema(0, 3),
    construction_date: validDateSchema(),
    area: validNumberSchema(50, Infinity, "Area must be greater than 50 sqft."),
  }),
  description: z.object({
    property_description: z
      .string()
      .min(30, { message: "Description must have atleast 30 characters." })
      .refine((str) => str != null && str != undefined && str != ""),
  }),
  pricingAndContacts: z.object({
    phone: phoneNumberSchema,
    price: validNumberSchema(
      100,
      Infinity,
      "Price must be greater than 100 Rs."
    ),
  }),
  images: z.object({
    images: z.array(z.string()).refine((arr) => arr.length > 0, {
      message: "Must Provide 2 images thumbnail + 1.",
    }),
  }),
};

export default stepSchemas;
