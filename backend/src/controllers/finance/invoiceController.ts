import { Request, Response } from "express";
import Invoice from "../../models/finance/Invoice";

export const getInvoices = async (
  req: Request,
  res: Response
) => {
  const invoices = await Invoice.find();
  res.json(invoices);
};

export const createInvoice = async (
  req: Request,
  res: Response
) => {
  const invoice = await Invoice.create(req.body);
  res.status(201).json(invoice);
};

export const updateInvoice = async (
  req: Request,
  res: Response
) => {
  const invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(invoice);
};

export const deleteInvoice = async (
  req: Request,
  res: Response
) => {
  await Invoice.findByIdAndDelete(req.params.id);

  res.json({
    message: "Invoice deleted",
  });
};