import express from "express";
import SearchController from "../controller/SearchController";
const router = express.Router();

router.get("/", SearchController.keyword);

export default router;
