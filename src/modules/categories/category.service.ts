import prisma from "../../config/db";

interface CreateCategoryData {
  name: string;
  description?: string;
}

export const createCategory = async (data: CreateCategoryData) => {
  const existingCategory = await prisma.category.findUnique({
    where: {
      name: data.name,
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return prisma.category.create({
    data,
  });
};

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      projects: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryData>
) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return prisma.category.update({
    where: { id },
    data,
  });
};

export const deleteCategory = async (id: string) => {
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      projects: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  if (category.projects.length > 0) {
    throw new Error(
      "Cannot delete a category that has projects"
    );
  }

  await prisma.category.delete({
    where: { id },
  });
};