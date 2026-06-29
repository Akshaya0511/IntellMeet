import express from "express";

import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
} from "../../controllers/finance/currencyController";

const router = express.Router();

router.get("/", getCurrencies);
router.post("/", createCurrency);
router.put("/:id", updateCurrency);
router.delete("/:id", deleteCurrency);

export default router;