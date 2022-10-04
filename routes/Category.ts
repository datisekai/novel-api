import express from "express";
import CategoryController from "../controller/CategoryController";

const router = express.Router();

router.get("/", CategoryController.getCategory);

export default router;
