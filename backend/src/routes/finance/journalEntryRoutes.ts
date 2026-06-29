import express from "express";

import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "../../controllers/finance/journalEntryController";

const router = express.Router();

router.get("/", getJournalEntries);
router.post("/", createJournalEntry);
router.put("/:id", updateJournalEntry);
router.delete("/:id", deleteJournalEntry);

export default router;