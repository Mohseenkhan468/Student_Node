import { Router } from "express";
import { addMarks, deleteMarksId, getMarksByStudentId, updateMarksId } from "../controllers/marksController.js";

const marksRouter=Router()

marksRouter.get('/:studentId',getMarksByStudentId)
marksRouter.post('/:studentId',addMarks)
marksRouter.patch('/:id',updateMarksId)
marksRouter.delete('/:id',deleteMarksId)
export default marksRouter;