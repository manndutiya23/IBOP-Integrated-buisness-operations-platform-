import mongoose from "mongoose";
import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, role, department, salary, phone, joiningDate } = req.body;
    if (!name?.trim() || !email?.trim() || !password || !role || !department?.trim() || salary === undefined || !phone?.trim() || !joiningDate) {
      return res.status(400).json({ message: "All employee fields, including an initial password, are required." });
    }
    if (typeof password !== "string" || password.length < 12 || password.length > 128) {
      return res.status(400).json({ message: "Initial password must be between 12 and 128 characters." });
    }
    if (!Number.isFinite(Number(salary)) || Number(salary) < 0 || Number(salary) > 100000000) {
      return res.status(400).json({ message: "Enter a valid salary." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      return res.status(400).json({ message: "Enter a valid email address." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (await Employee.findOne({ email: normalizedEmail })) {
      return res.status(409).json({ message: "An employee with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const employee = await Employee.create({
      name: name.trim(), email: normalizedEmail, password: hashedPassword, role,
      department: department.trim(), salary: Number(salary), phone: phone.trim(), joiningDate,
    });

    return res.status(201).json({
      message: "Employee created successfully.",
      employee: {
        _id: employee._id, name: employee.name, email: employee.email, role: employee.role,
        department: employee.department, salary: employee.salary, phone: employee.phone,
        joiningDate: employee.joiningDate, isActive: employee.isActive,
      },
    });
  } catch (error) {
    console.error("CREATE EMPLOYEE ERROR:", error.message);
    return res.status(500).json({ message: "Failed to create employee." });
  }
};

export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 }).select("-password");
    return res.json(employees);
  } catch (error) {
    console.error("GET EMPLOYEES ERROR:", error.message);
    return res.status(500).json({ message: "Failed to fetch employees." });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid employee ID." });
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found." });
    await employee.deleteOne();
    return res.json({ message: "Employee deleted successfully." });
  } catch (error) {
    console.error("DELETE EMPLOYEE ERROR:", error.message);
    return res.status(500).json({ message: "Failed to delete employee." });
  }
};

export const loginEmployee = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");
      return res.status(500).json({ message: "Authentication service is unavailable." });
    }

    const employee = await Employee.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!employee || employee.isActive === false) {
      return res.status(401).json({ message: "Invalid credentials or inactive account." });
    }
    if (!(await bcrypt.compare(password, employee.password))) {
      return res.status(401).json({ message: "Invalid credentials or inactive account." });
    }

    const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({
      token,
      employee: { _id: employee._id, name: employee.name, email: employee.email, role: employee.role, department: employee.department },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    return res.status(500).json({ message: "Login failed." });
  }
};
