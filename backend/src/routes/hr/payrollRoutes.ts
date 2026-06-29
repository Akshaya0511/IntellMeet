import express from "express";

import {
  createPayroll,
  getPayrolls,
  updatePayroll,
  deletePayroll,
} from "../../controllers/hr/payrollController";

const router = express.Router();

router.post("/", createPayroll);
router.get("/", getPayrolls);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

export default router;