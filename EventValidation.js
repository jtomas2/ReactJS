import * as Yup from "yup";

const eventSchema = Yup.object().shape({
  eventTypeId: Yup.number()
    .min(1, "Event type is required")
    .required("Event type is required"),
  name: Yup.string()
    .max(255, "Name cannot exceed 255 characters")
    .required("Name is required"),
  summary: Yup.string()
    .max(255, "Summary cannot exceed 255 characters")
    .required("Summary is required"),
  shortDescription: Yup.string()
    .max(4000, "Summary cannot exceed 4000 characters")
    .required("Summary is required"),
  eventStatusId: Yup.number()
    .min(1, "Event Status is required")
    .required("Event status is required"),
  imageUrl: Yup.string().max(400, "Image Url cannot exceed 400 characters"),
  externalSiteUrl: Yup.string().max(
    400,
    "Website Url cannot exceed 400 characters"
  )
});

export default eventSchema;
