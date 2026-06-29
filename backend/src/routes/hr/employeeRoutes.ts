import express from "express";

import {
  createEmployee,
  getEmployees,
  updateEmployee,
  deleteEmployee,
} from "../../controllers/hr/employeeController";

import { employeeValidation, validateRequest } from "../../validators/hr.validator";

const router = express.Router();

router.post("/", employeeValidation, validateRequest, createEmployee);
router.get("/", getEmployees);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);

export default router;