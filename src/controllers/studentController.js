import Joi from "joi";
import { prismaClient } from "../../app.js";
// Create a new student
export const createStudent = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing.",
      });
    }
    const schema = Joi.object({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      age: Joi.number().min(3).required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { name, email, age } = req.body;
    const isAlreadyExist = await prismaClient.student.findUnique({
      where: { email },
    });
    if (isAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "This student is already exists.",
      });
    }
    const student = await prismaClient.student.create({
      data: { name, email, age },
    });
    res.status(201).json({
      success: true,
      message: "Student created successfully.",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all students with pagination
export const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const students = await prismaClient.student.findMany({
      include: { marks: true },
      skip,
      take: Number(limit),
      orderBy:{createdAt:'desc'}
    });
    const total = await prismaClient.student.count();
    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      limit: Number(limit),
      total_pages: Math.ceil(total / limit),
      data: students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Get student by ID with marks
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prismaClient.student.findUnique({
      where: { id },
      include: { marks: true },
    });
    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update student information
export const updateStudentById = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing.",
      });
    }

    const { id } = req.params;
    const isAlreadyExist = await prismaClient.student.findFirst({
      where: {
        email: req?.body?.email,
        NOT: { id: id },
      },
    });
    if (isAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "This email is already registered.",
      });
    }
    const student = await prismaClient.student.findUnique({
      where: { id },
    });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found.",
      });
    }
    const schema = Joi.object({
      email: Joi.string().email().optional(),
      name: Joi.string().optional(),
      age: Joi.number().min(3).optional(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const updateStudent = await prismaClient.student.update({
      where: { id },
      data: { ...req.body },
    });
    return res.status(201).json({
      success: true,
      message: "Student updated succesfully.",
      data: updateStudent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete student
export const deleteStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prismaClient.student.findFirst({
      where: { id },
    });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found.",
      });
    }
    await prismaClient.student.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
