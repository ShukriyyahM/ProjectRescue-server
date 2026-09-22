import { Request, Response, NextFunction } from "express";
import {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory} from "./category.service";
import {createCategorySchema, updateCategorySchema} from "./category.validation";

export const createCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createCategorySchema.parse(req.body);

    const category = await createCategory(data);

    res.status(201).json({
      status: "success",
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await getAllCategories();

    res.status(200).json({
      status: "success",
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await getCategoryById(String(req.params.id));

    res.status(200).json({
      status: "success",
      message: "Category retrieved successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = updateCategorySchema.parse(req.body);

    const category = await updateCategory(
      String(req.params.id),
      data
    );

    res.status(200).json({
      status: "success",
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteCategory(String(req.params.id));

    res.status(200).json({
      status: "success",
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};