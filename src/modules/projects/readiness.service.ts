import prisma from "../../config/db";

export const calculateRescueReadiness = async (projectId: string) => {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      documentation: true,
      technologies: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  let score = 0;

  // 1. Basic project information — 5 points
  if (project.description) score += 2;
  if (project.targetUsers) score += 2;
  if (project.categoryId) score += 1;

  // 2. Technical information — 20 points
  const technicalFields = [
    project.frontend,
    project.backend,
    project.database,
    project.apis,
    project.authentication,
    project.deployment,
    project.otherTechnologies,
  ];

  const completedTechnicalFields = technicalFields.filter(Boolean).length;

  score += Math.round((completedTechnicalFields / 7) * 20);

  // 3. Repository availability — 15 points
  if (project.repositoryUrl) {
    score += 15;
  }

  // 4. Project condition / remaining work — 15 points
  if (project.knownBugs) score += 5;
  if (project.unfinishedFeatures) score += 5;
  if (project.currentBlockers) score += 5;

  // 5. Development history — 10 points
  if (project.lastDevelopmentDate) {
    score += 5;
  }

  if (project.completionPercentage > 0) {
    score += 5;
  }

  // 6. Abandonment information — 10 points
  if (project.abandonmentReasons) score += 5;
  if (project.abandonmentExplanation) score += 5;

  // 7. Handover documentation — 25 points
  const documentation = project.documentation;

  if (documentation) {
    const documentationFields = [
      documentation.projectOverview,
      documentation.architecture,
      documentation.setupInstructions,
      documentation.environmentRequirements,
      documentation.knownProblems,
      documentation.importantDecisions,
      documentation.remainingWork,
      documentation.importantResources,
    ];

    const completedDocumentationFields =
      documentationFields.filter(Boolean).length;

    score += Math.round(
      (completedDocumentationFields / 8) * 25
    );
  }

  // Make sure score never goes outside 0–100
  score = Math.max(0, Math.min(100, score));

  let readinessLevel: string;

  if (score >= 80) {
    readinessLevel = "HIGHLY_RECOVERABLE";
  } else if (score >= 50) {
    readinessLevel = "REQUIRES_PREPARATION";
  } else {
    readinessLevel = "DIFFICULT_TO_RECOVER";
  }

  // Save the calculated score
  const updatedProject = await prisma.project.update({
    where: { id: projectId },
    data: {
      rescueReadinessScore: score,
    },
    select: {
      id: true,
      name: true,
      rescueReadinessScore: true,
    },
  });

  return {
    project: updatedProject,
    score,
    readinessLevel,
  };
};