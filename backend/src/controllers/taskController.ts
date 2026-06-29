import { Request, Response } from "express";
import Task from "../models/Task";

export const createTask = async (
    req: Request,
    res: Response
) => {
    const task = await Task.create(req.body);
    res.json(task);
};

export const getTasks = async (
    req: Request,
    res: Response
) => {
    const tasks = await Task.find();
    res.json(tasks);
};

export const updateTask = async (
    req: Request,
    res: Response
) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true}
        );

        res.json(task);
    } catch (error) {
        res.status(500).json({
          message: "Update failed",

        });
    }
};