import express from "express";
import DetailController from "../controller/DetailController";

const router = express.Router();

router.get("/read/:id", DetailController.detail);
router.get("/", DetailController.read);
router.get("/chapter", DetailController.chapter);

export default router;
