import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  getAllSkills,
  getMySkills,
  addSkillToUser,
  removeSkillFromUser,
} from "./skill.service";
import { createSkillSchema, skillIdSchema } from "./skill.validation";

export const getSkills = async (
  _req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const skills = await getAllSkills();

    res.status(200).json({
      status: "success",
      message: "Skills retrieved successfully",
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const getMySkillsController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const skills = await getMySkills(userId);

    res.status(200).json({
      status: "success",
      message: "User skills retrieved successfully",
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const { name } = createSkillSchema.parse(req.body);

    const skill = await addSkillToUser(userId, name);

    res.status(201).json({
      status: "success",
      message: "Skill added successfully",
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

export const removeSkill = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    const { skillId } = skillIdSchema.parse(req.params);

    await removeSkillFromUser(userId, skillId);

    res.status(200).json({
      status: "success",
      message: "Skill removed successfully",
    });
  } catch (error) {
    next(error);
  }
};