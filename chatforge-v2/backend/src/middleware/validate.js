import { ZodError } from "zod";
import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const errors = err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));
      return next(new ApiError(400, "Validation failed", errors));
    }
    next(err);
  }
};

export default validate;
