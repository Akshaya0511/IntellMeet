import { Request, Response } from "express";
import * as employeeService from "../../services/hr/employeeService";

// Create Employee
export const createEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const employee = await employeeService.addEmployee(req.body);

    return res.status(201).json(employee);
  } catch (error: any) {
    if (error.message === "Employee ID already exists") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Employees
export const getEmployees = async (
  req: Request,
  res: Response
) => {
  try {
    const employees = 
    await employeeService.getAllEmployees();

    return res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
      } catch (error: any) {
        return res.status(500).json({
          success: false,
          message: error.message,
    });
  }
};

// Update Employee
export const updateEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    const employee =
      await employeeService.editEmployee(
        req.params.id as string,
        req.body,
      );

      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Employee updated successfully",
        data: employee,
      });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Employee
export const deleteEmployee = async (
  req: Request,
  res: Response
) => {
  try {
    await employeeService.removeEmployee(
      req.params.id as string
    );

    res.json({
      message: "Employee deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};