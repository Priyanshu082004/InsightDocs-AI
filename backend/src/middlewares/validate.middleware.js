import { ApiError } from "../utils/ApiError.js";
import { HTTP_STATUS } from "../constants/httpStatus.constant.js";


//  Generic validator: pass any Zod schema, get back Express middleware.
//   Every module's *.validation.js exports schemas; routes wire them here
//  so no controller ever has to check `if (!req.body.email)` by hand.

//  Usage: router.post("/register", validate(registerSchema), controller.register)
 
export const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const formattedErrors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return next(
        new ApiError(HTTP_STATUS.UNPROCESSABLE_ENTITY, "Validation failed", formattedErrors)
      );
    }

     if (source === "query") {
      Object.assign(req.query, result.data);
    } else {
      req[source] = result.data;
    }

    next();
  };
};