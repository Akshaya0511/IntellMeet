import { Request, Response } from "express";
import Leave from "../../models/hr/Leave";

export const createLeave = async (
  req: Request,
  res: Response
) => {
    try {
  const leave = await Leave.create(req.body);
  res.status(201).json(leave);
} catch (error) {
    res.status(500).json({ message: "Error creating leave "});
}
}

export const getLeaves = async (
  req: Request,
  res: Response
) => {
    try {
  const leaves = await Leave.find();

  res.json(leaves);
} catch (error) {
    res.status(500).json({ message: "Error fetching leaves"});
}
};

export const updateLeave = async (
  req: Request,
  res: Response
) => {
  const leave = await Leave.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(leave);
};

export const deleteLeave = async (
  req: Request,
  res: Response
) => {
  await Leave.findByIdAndDelete(req.params.id);

  res.json({
    message: "Leave deleted",
  });
};