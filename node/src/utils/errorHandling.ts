import { FormattedError } from "../types/errors.ts";
import { FastifySchemaValidationError } from "fastify/types/schema.js";

const createErrorMessage = (
  errors: FastifySchemaValidationError[]
): FormattedError[] => {
  return errors.map((error): FormattedError => {
    // console.log(error);

    let field: string;
    let message: string;

    switch (error.keyword) {
      case "required":
        field = error.params.missingProperty as string;
        message = `${field} is required`;
        break;
      case "const":
        field = error.instancePath.replace("/", "");
        message = `${field} must be equal to ${
          (error.params as any).allowedValue
        }`;
        break;
      case "minLength":
        field = error.instancePath.replace("/", "");
        message = `${field} must be at least ${
          (error.params as any).limit
        } characters long`;
        break;
      case "maxLength":
        field = error.instancePath.replace("/", "");
        message = `${field} must not exceed ${
          (error.params as any).limit
        } characters`;
        break;
      case "format":
        field = error.instancePath.replace("/", "");
        message = `${field} must be a valid ${(error.params as any).format}`;
        break;
      case "additionalProperties":
        field = error.params.additionalProperty as string;
        message = `${field} is not allowed`;
        break;
      default:
        field = error.instancePath.replace("/", "") || "unknown";
        message = error.message ?? "Unknown error";
        break;
    }

    return { field, message };
  });
};