import { Request, Response } from "express";
import Payroll from "../../models/hr/Payroll";

// Create Payroll
export const createPayroll = async (
  req: Request,
  res: Response
) => {
  try {
    const payroll = await Payroll.create(req.body);
    res.status(201).json(payroll);
  } catch (error) {
    res.status(500).json({ message: "Error creating payroll" });
  }
};

// Get All Payrolls
export const getPayrolls = async (
  req: Request,
  res: Response
) => {
  try {
    const payrolls = await Payroll.find();
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payrolls" });
  }
};

// Update Payroll
export const updatePayroll = async (
  req: Request,
  res: Response
) => {
  try {
    const payroll = await Payroll.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: "Error updating payroll" });
  }
};

// Delete Payroll
export const deletePayroll = async (
  req: Request,
  res: Response
) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);

    res.json({
      message: "Payroll deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payroll" });
  }
};