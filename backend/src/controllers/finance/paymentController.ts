import { Request, Response } from "express";
import Payment from "../../models/finance/Payment";

export const getPayments = async (
  req: Request,
  res: Response
) => {
  const payments = await Payment.find();
  res.json(payments);
};

export const createPayment = async (
  req: Request,
  res: Response
) => {
  const payment = await Payment.create(req.body);
  res.status(201).json(payment);
};

export const updatePayment = async (
  req: Request,
  res: Response
) => {
  const payment = await Payment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(payment);
};

export const deletePayment = async (
  req: Request,
  res: Response
) => {
  await Payment.findByIdAndDelete(req.params.id);

  res.json({
    message: "Payment deleted",
  });
};