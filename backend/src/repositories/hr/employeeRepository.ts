import Employee from "../../models/hr/Employee";

export const findAllEmployees = async () => {
  return await Employee.find();
};

export const createEmployee = async (data: any) => {
  return await Employee.create(data);
};

export const updateEmployee = async (
  id: string,
  data: any
) => {
  return await Employee.findByIdAndUpdate(
    id,
    data,
    { new: true }
  );
};

export const deleteEmployee = async (
  id: string
) => {
  return await Employee.findByIdAndDelete(id);
};

export const findEmployeeById = async (
  id: string
) => {
  return await Employee.findById(id);
};