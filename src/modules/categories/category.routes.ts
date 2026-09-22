import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {createCategoryController, getCategories, getCategory, updateCategoryController, deleteCategoryController} from "./category.controller";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);

router.post("/", authenticate, createCategoryController);
router.patch("/:id", authenticate, updateCategoryController);
router.delete("/:id", authenticate, deleteCategoryController);

export default router;