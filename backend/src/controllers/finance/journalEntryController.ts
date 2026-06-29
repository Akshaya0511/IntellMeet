import { Request, Response } from "express";
import JournalEntry from "../../models/finance/JournalEntry";

export const getJournalEntries = async (
  req: Request,
  res: Response
) => {
  const entries = await JournalEntry.find();
  res.json(entries);
};

export const createJournalEntry = async (
  req: Request,
  res: Response
) => {
  const entry = await JournalEntry.create(req.body);
  res.status(201).json(entry);
};

export const updateJournalEntry = async (
  req: Request,
  res: Response
) => {
  const entry = await JournalEntry.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(entry);
};

export const deleteJournalEntry = async (
  req: Request,
  res: Response
) => {
  await JournalEntry.findByIdAndDelete(req.params.id);

  res.json({
    message: "Journal Entry deleted",
  });
};