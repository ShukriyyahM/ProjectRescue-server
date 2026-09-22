import prisma from "../../config/db";
import { sendNotification } from "../notifications/notification.helper";

interface CreateTaskData {
  title: string;
  description?: string;
  assignedToId?: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: Date;
}

interface UpdateTaskData {
  title?: string;
  description?: string;
  assignedToId?: string | null;
  status?: "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate?: Date | null;
}

const ensureProjectMember = async (
  projectId: string,
  userId: string
) => {
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

  return member;
};

export const createTask = async (projectId: string, userId: string, data: CreateTaskData) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== userId) {
    await ensureProjectMember(projectId, userId);
  }

  if (data.assignedToId) {
    await ensureProjectMember(projectId, data.assignedToId);
  }

  const task = await prisma.task.create({
  data: {
    projectId,
    title: data.title,
    description: data.description,
    assignedToId: data.assignedToId,
    priority: data.priority ?? "MEDIUM",
    dueDate: data.dueDate,
  },
  include: {
    assignedTo: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    project: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});

if (task.assignedTo) {
  await sendNotification({
    userId: task.assignedTo.id,
    projectId: task.project.id,
    type: "TASK_ASSIGNED",
    title: "New Task Assigned",
    message: `You have been assigned a new task "${task.title}" for project "${task.project.name}".`,
  });
}

return task;
}
export const getProjectTasks = async (
  projectId: string,
  userId: string
) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId !== userId) {
    await ensureProjectMember(projectId, userId);
  }

  return prisma.task.findMany({
    where: { projectId },
    orderBy: [
      { status: "asc" },
      { priority: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const getTaskById = async (
  taskId: string,
  userId: string
) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.ownerId !== userId) {
    await ensureProjectMember(task.projectId, userId);
  }

  return task;
};

export const updateTask = async (taskId: string, userId: string, data: UpdateTaskData) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.ownerId !== userId) {
    await ensureProjectMember(task.projectId, userId);
  }

  if (data.assignedToId) {
    await ensureProjectMember(
      task.projectId,
      data.assignedToId
    );
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data,
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      project: {
        select: {id: true, name: true}
      }}
    });

  if (updatedTask.assignedTo) {
    await sendNotification({
      userId: updatedTask.assignedTo.id,
      projectId: updatedTask.project.id,
      type: "TASK_UPDATED",
      title: "Task Updated",
      message: `The task "${updatedTask.title}" in project "${updatedTask.project.name}" has been updated.`,
    });
  }

  if (
    data.assignedToId &&
    data.assignedToId !== task.assignedTo?.id
  ) {
    await sendNotification({
      userId: data.assignedToId,
      projectId: updatedTask.project.id,
      type: "TASK_ASSIGNED",
      title: "Task Assigned to You",
      message: `You have been assigned the task "${updatedTask.title}" for project "${updatedTask.project.name}".`,
    });
  }

  return updatedTask;
};

export const deleteTask = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      project: true,
    },
  });

  if (!task) {
    throw new Error("Task not found");
  }

  if (task.project.ownerId !== userId) {
    throw new Error("Only the project owner can delete tasks");
  }

  await prisma.task.delete({
    where: { id: taskId },
  });
};