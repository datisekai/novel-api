import express from "express";
import HomeController from "../controller/HomeController";
const router = express.Router();

router.get("/hot", HomeController.getTruyenHot);
router.get("/moi-cap-nhat", HomeController.getTruyenMoiCapNhat);
router.get("/da-hoan-thanh", HomeController.getTruyenDaHoanThanh);

export default router;
