import * as employeeRepository from "../../repositories/hr/employeeRepository";

// Get all employees
export const getAllEmployees = async () => {
  return await employeeRepository.findAllEmployees();
};

// Create employee
export const addEmployee = async (data: any) => {
  const existingEmployees =
    await employeeRepository.findAllEmployees();

  const existing = existingEmployees.find(
    (emp: any) => emp.employeeId === data.employeeId
  );

  if (existing) {
    throw new Error("Employee ID already exists");
  }

  return await employeeRepository.createEmployee(data);
};

// Update employee
export const editEmployee = async (
  id: string,
  data: any
) => {
  return await employeeRepository.updateEmployee(id, data);
};

// Delete employee
export const removeEmployee = async (
  id: string
) => {
  return await employeeRepository.deleteEmployee(id);
};

// Get employee by ID
export const getEmployeeById = async (
  id: string
) => {
  return await employeeRepository.findEmployeeById(id);
};