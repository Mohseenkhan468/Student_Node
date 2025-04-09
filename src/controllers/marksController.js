import Joi from "joi";
import { prismaClient } from "../../app.js";
export const addMarks = async (req, res) => {
  try {
    const studentId = req?.params?.studentId;
    const student = await prismaClient.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found.",
      });
    }
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing.",
      });
    }
    const schema = Joi.object({
      subject: Joi.string().required(),
      score: Joi.number().min(3).required(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { subject, score } = req.body;
    const isAlreadyExist = await prismaClient.mark.findFirst({
      where: { subject, studentId },
    });
    if (isAlreadyExist) {
      return res.status(400).json({
        success: false,
        message: "Student marks for this subject already added.",
      });
    }
    const marks = await prismaClient.mark.create({
      data: { subject, score, studentId },
    });
    res.status(201).json({
      success: true,
      message: "Marks added successfully.",
      data: marks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

///////////////Get Student Marks//////////////
export const getMarksByStudentId = async (req, res) => {
  try {
    const { studentId } = req?.params;
    const student = await prismaClient.student.findUnique({
      where: { id: studentId },
    });
    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found.",
      });
    }
    const marks = await prismaClient.mark.findMany({ where: { studentId } });
    return res.status(200).json({
      success: true,
      data: marks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

////////////////////Update Student Marks/////////////////////
export const updateMarksId = async (req, res) => {
  try {
    const id = req?.params?.id;
    const marks = await prismaClient.mark.findUnique({
      where: { id },
    });
    if (!marks) {
      return res.status(400).json({
        success: false,
        message: "Marks not found.",
      });
    }
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing.",
      });
    }
    const schema = Joi.object({
      subject: Joi.string().optional(),
      score: Joi.number().min(3).optional(),
    });
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const updatedMarks = await prismaClient.mark.update({
      where: { id },
      data: { ...req.body },
    });
    return res.status(201).json({
      success: true,
      message: "Marks updated succesfully.",
      data: updatedMarks,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Delete student Marks
export const deleteMarksId = async (req, res) => {
  try {
    const id = req?.params?.id;
    console.log('id',id)
    const marks = await prismaClient.mark.findUnique({
      where: { id },
    });
    if (!marks) {
      return res.status(400).json({
        success: false,
        message: "Marks not found.",
      });
    }
    await prismaClient.mark.delete({ where: { id } });
    res.status(200).json({
      success: true,
      message: "Marks deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
