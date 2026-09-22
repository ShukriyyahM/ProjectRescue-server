import prisma from "../../config/db";
import { sendNotification } from "../notifications/notification.helper";

interface CreateIssueData {
  title: string;
  description?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

interface UpdateIssueData {
  title?: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

const ensureProjectAccess = async (
  projectId: string,
  userId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId === userId) {
    return project;
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  if (!member) {
    throw new Error("User is not a member of this project");
  }

  return project;
};

export const createIssue = async (projectId: string, userId: string, data: CreateIssueData) => {
  await ensureProjectAccess(projectId, userId);

  const issue = await prisma.issue.create({
     data: {
       projectId,
       title: data.title,
       description: data.description,
       priority: data.priority ?? "MEDIUM",
      },
     include: {
       project: {
         select: {
           id: true,
           name: true,
           ownerId: true,
          }}
      }});

     await sendNotification({
       userId: issue.project.ownerId,
       projectId: issue.project.id,
       type: "ISSUE_CREATED",
       title: "New Issue Created",
       message: `A new issue "${issue.title}" was created for project "${issue.project.name}".`,
      });

     return issue;
};

export const getProjectIssues = async (projectId: string, userId: string) => {
  await ensureProjectAccess(projectId, userId);

  return prisma.issue.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
};

export const getIssueById = async (issueId: string, userId: string) => {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
    },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  await ensureProjectAccess(issue.projectId, userId);

  return issue;
};

export const updateIssue = async (issueId: string, userId: string, data: UpdateIssueData) => {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
    },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  await ensureProjectAccess(issue.projectId, userId);

  const updateData: {
    title?: string;
    description?: string;
    status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
    priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
    resolvedAt?: Date | null;
  } = {
    ...data,
  };

  if (data.status === "RESOLVED") {
    updateData.resolvedAt = new Date();
  }

  if (
    data.status &&
    data.status !== "RESOLVED" &&
    issue.status === "RESOLVED"
  ) {
    updateData.resolvedAt = null;
  }

  const updatedIssue = await prisma.issue.update({
    where: { id: issueId },
    data: updateData,
    include: {
      project: {
        select: {
          id: true,
          name: true,
          ownerId: true,
        },
      },
    },
  });

  await sendNotification({
    userId: updatedIssue.project.ownerId,
    projectId: updatedIssue.project.id,
    type: "ISSUE_UPDATED",
    title: "Issue Updated",
    message: `The issue "${updatedIssue.title}" in project "${updatedIssue.project.name}" has been updated.`,
  });

  return updatedIssue;
};

export const deleteIssue = async (issueId: string, userId: string) => {
  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      project: true,
    },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  if (issue.project.ownerId !== userId) {
    throw new Error("Only the project owner can delete issues");
  }

  await prisma.issue.delete({
    where: { id: issueId },
  });
};