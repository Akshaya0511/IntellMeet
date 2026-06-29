import { Request, Response } from "express";
import Currency from "../../models/finance/Currency";

// GET All Currencies
export const getCurrencies = async (
  req: Request,
  res: Response
) => {
  try {
    const currencies = await Currency.find();
    res.json(currencies);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE Currency
export const createCurrency = async (
  req: Request,
  res: Response
) => {
  try {
    const currency = await Currency.create(req.body);
    res.status(201).json(currency);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE Currency
export const updateCurrency = async (
  req: Request,
  res: Response
) => {
  try {
    const currency = await Currency.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(currency);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE Currency
export const deleteCurrency = async (
  req: Request,
  res: Response
) => {
  try {
    await Currency.findByIdAndDelete(req.params.id);

    res.json({
      message: "Currency deleted successfully",
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};