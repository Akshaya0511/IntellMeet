import { useEffect, useState } from "react";

interface Employee {
  _id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  designation: string;
}

const Employee = () => {
  const [employee, setEmployee] = useState<Employee[]>([]);

  const [form, setForm] = useState({
    employeeId: "",
    name: "",
    email: "",
    department: "",
    designation: "",
  });

  useEffect(() => {
    fetchEmployee();
  }, []);

  const fetchEmployee = async () => {
    const res = await fetch(
      "http://localhost:5000/api/employee"
    );

    const data = await res.json();

    setEmployee(data);
  };

  const createEmployee = async () => {
    await fetch(
      "http://localhost:5000/api/employee",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(form),
      }
    );

    setForm({
      employeeId: "",
      name: "",
      email: "",
      department: "",
      designation: "",
    });

    fetchEmployee();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Employee Management</h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          width: "300px",
        }}
      >
        <input
          placeholder="Employee ID"
          value={form.employeeId}
          onChange={(e) =>
            setForm({
              ...form,
              employeeId: e.target.value,
            })
          }
        />

        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          placeholder="Department"
          value={form.department}
          onChange={(e) =>
            setForm({
              ...form,
              department: e.target.value,
            })
          }
        />

        <input
          placeholder="Designation"
          value={form.designation}
          onChange={(e) =>
            setForm({
              ...form,
              designation: e.target.value,
            })
          }
        />

        <button onClick={createEmployee}>
          Add Employee
        </button>
      </div>

      <hr />

      <h2>Employees</h2>

      {employee.map((emp) => (
        <div
          key={emp._id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{emp.name}</h3>

          <p>ID: {emp.employeeId}</p>

          <p>Email: {emp.email}</p>

          <p>Department: {emp.department}</p>

          <p>Designation: {emp.designation}</p>
        </div>
      ))}
    </div>
  );
};

export default Employee;