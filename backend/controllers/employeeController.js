import Employee from "../models/Employee.js";


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

    const employee = new Employee({
      name,
      email,
      password: generatedPassword,
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