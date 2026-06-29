import express from "express";
import {
  createPayslip,
  getPayslips,
  updatePayslip,
  deletePayslip,
} from "../../controllers/hr/payslipController";

const router = express.Router();

router.get("/", getPayslips);
router.post("/", createPayslip);
router.put("/:id", updatePayslip);
router.delete("/:id", deletePayslip);

export default router;