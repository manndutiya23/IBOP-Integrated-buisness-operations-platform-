import Employee from "../models/Employee.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// GENERATE DEFAULT PASSWORD
const generatePassword = (email, phone) => {

  const username = email.split("@")[0];

  const lastThreeDigits = phone.slice(-3);

  return `${username}${lastThreeDigits}`;
};



// CREATE EMPLOYEE
export const createEmployee = async (req, res) => {
  try {

    const {
      name,
      email,
      role,
      department,
      salary,
      phone,
      joiningDate,
    } = req.body;

    // check existing employee
    const existingEmployee = await Employee.findOne({
      email,
    });

    if (existingEmployee) {
      return res.status(400).json({
        message: "Employee already exists",
      });
    }

    // auto-generate password
    const generatedPassword = generatePassword(
      email,
      phone
    );
// hash password
const hashedPassword = await bcrypt.hash(
  generatedPassword,
  10
);

const employee = new Employee({
  name,
  email,
  password: hashedPassword,
  role,
  department,
  salary,
  phone,
  joiningDate,
});

    await employee.save();

    res.status(201).json({
      message: "Employee created successfully",
      employee,
      generatedPassword,
    });

  } catch (error) {

    console.error(
      "CREATE EMPLOYEE ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to create employee",
    });
  }
};



// GET ALL EMPLOYEES
export const getEmployees = async (req, res) => {
  try {

    const employees = await Employee.find().sort({
      createdAt: -1,
    });

    res.json(employees);

  } catch (error) {

    console.error(
      "GET EMPLOYEES ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};



// DELETE EMPLOYEE
export const deleteEmployee = async (
  req,
  res
) => {
  try {

    const employee = await Employee.findById(
      req.params.id
    );

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    await employee.deleteOne();

    res.json({
      message: "Employee deleted successfully",
    });

  } catch (error) {

    console.error(
      "DELETE EMPLOYEE ERROR:",
      error
    );

    res.status(500).json({
      message: "Failed to delete employee",
    });
  }
};

// LOGIN
export const loginEmployee = async (
  req,
  res
) => {
  try {

    const { email, password } = req.body;

    // check employee
    const employee = await Employee.findOne({
      email,
    });

    if (!employee) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(
      password,
      employee.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // create JWT token
    const token = jwt.sign(
      {
        id: employee._id,
        role: employee.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,

      employee: {
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
      },
    });

  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message: "Login failed",
    });
  }
};