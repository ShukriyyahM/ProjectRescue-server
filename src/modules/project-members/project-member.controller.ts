import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import {
  addProjectMemberSchema,
  updateProjectMemberSchema,
} from "./project-member.validation";
import {
  getProjectMembers,
  addProjectMember,
  updateProjectMemberRole,
  removeProjectMember,
} from "./project-member.service";

export const getProjectMembersController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const members = await getProjectMembers(projectId);

  res.status(200).json({
    status: "success",
    data: members,
  });
};

export const addProjectMemberController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);

  const data = addProjectMemberSchema.parse(req.body);

  const member = await addProjectMember(
    projectId,
    req.user!.userId,
    data
  );

  res.status(201).json({
    status: "success",
    message: "Project member added successfully",
    data: member,
  });
};

export const updateProjectMemberRoleController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);
  const memberId = String(req.params.memberId);

  const { role } = updateProjectMemberSchema.parse(req.body);

  const member = await updateProjectMemberRole(
    projectId,
    memberId,
    req.user!.userId,
    role
  );

  res.status(200).json({
    status: "success",
    message: "Project member role updated successfully",
    data: member,
  });
};

export const removeProjectMemberController = async (
  req: AuthRequest,
  res: Response
) => {
  const projectId = String(req.params.projectId);
  const memberId = String(req.params.memberId);

  await removeProjectMember(
    projectId,
    memberId,
    req.user!.userId
  );

  res.status(200).json({
    status: "success",
    message: "Project member removed successfully",
  });
};