import { Request, Response } from "express";
import Payslip from "../../models/hr/Payslip";

export const getPayslips = async (
  req: Request,
  res: Response
) => {
  const payslips = await Payslip.find();
  res.json(payslips);
};

export const createPayslip = async (
  req: Request,
  res: Response
) => {
  const payslip = await Payslip.create(req.body);
  res.status(201).json(payslip);
};

export const updatePayslip = async (
  req: Request,
  res: Response
) => {
  const payslip = await Payslip.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(payslip);
};

export const deletePayslip = async (
  req: Request,
  res: Response
) => {
  await Payslip.findByIdAndDelete(req.params.id);

  res.json({ message: "Payslip deleted" });
};