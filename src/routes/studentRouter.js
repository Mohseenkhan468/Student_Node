import { Router } from "express";
import {
  createStudent,
  deleteStudentById,
  getAllStudents,
  getStudentById,
  updateStudentById,
} from "../controllers/studentController.js";

const studentRouter = Router();

studentRouter.post("/create", createStudent);
studentRouter.get("/single_student/:id", getStudentById);
studentRouter.get("/list", getAllStudents);
studentRouter.patch("/:id", updateStudentById);
studentRouter.delete("/:id", deleteStudentById);

export default studentRouter;
