import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const employeeValidation = [
  body("employeeId")
    .notEmpty()
    .withMessage("Employee ID is required"),

  body("firstName")
    .notEmpty()
    .withMessage("First name is required"),

  body("lastName")
    .notEmpty()
    .withMessage("Last name is required"),

  body("email")
    .isEmail()
    .withMessage("Invalid email"),

  body("department")
    .notEmpty()
    .withMessage("Department is required"),

  body("designation")
    .notEmpty()
    .withMessage("Designation is required"),

  body("salary")
    .isNumeric()
    .withMessage("Salary must be a number"),
];

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};