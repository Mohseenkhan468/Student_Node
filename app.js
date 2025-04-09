import express from "express";
import studentRouter from "./src/routes/studentRouter.js";
import { PrismaClient } from "@prisma/client";
import marksRouter from "./src/routes/marksRouter.js";
import "dotenv/config";
import cors from 'cors'
const app = express();
app.use(express.json());
app.use(cors())
export const prismaClient = new PrismaClient();
app.use("/students", studentRouter);
app.use("/marks", marksRouter);
const PORT = process.env.PORT || 4000;
// Start server
app.listen(4000, () => {
  console.log(`Server running on ${PORT}`);
});
