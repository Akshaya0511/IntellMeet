import { Request, Response } from "express";
import ChartOfAccounts from "../../models/finance/ChartofAccounts";

export const getAccounts = async (
  req: Request,
  res: Response
) => {
  const accounts = await ChartOfAccounts.find();
  res.json(accounts);
};

export const createAccount = async (
  req: Request,
  res: Response
) => {
  const account = await ChartOfAccounts.create(req.body);
  res.status(201).json(account);
};

export const updateAccount = async (
  req: Request,
  res: Response
) => {
  const account = await ChartOfAccounts.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(account);
};

export const deleteAccount = async (
  req: Request,
  res: Response
) => {
  await ChartOfAccounts.findByIdAndDelete(req.params.id);

  res.json({
    message: "Account deleted",
  });
};