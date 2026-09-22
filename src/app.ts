import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./modules/auth/auth.routes";
import authTestRoutes from "./modules/auth/auth.test.routes";
import userRoutes from "./modules/users/user.routes";
import skillRoutes from "./modules/skills/skill.routes";
import projectRoutes from "./modules/projects/project.routes"
import categoryRoutes from "./modules/categories/category.routes";
import documentationRoutes from "./modules/project-documentation/documentation.routes";
import technologyRoutes from "./modules/project-technologies/technology.routes";
import rescueRequestRoutes from "./modules/rescue-requests/rescue-request.routes";
import projectMemberRoutes from "./modules/project-members/project-member.routes";
import taskRoutes from "./modules/tasks/task.routes";
import issueRoutes from "./modules/issues/issue.routes";
import progressUpdateRoutes from "./modules/progress-updates/progress-update.routes";
import reviewRoutes from "./modules/reviews/review.routes";
import recoveryRoutes from "./modules/recovery/recovery.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import readinessRoutes from "./modules/projects/readiness.routes";
import adminRoutes from "./modules/admin/admin.routes";
import dashboardRoutes from "./modules/dashboard/dashboard.routes";
import refreshRoutes from "./modules/auth/refresh.routes";
import logoutRoutes from "./modules/auth/logout.routes";
import forgotPasswordRoutes from "./modules/auth/forgot-password.routes";

import { errorHandler } from "./middleware/error.middleware";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/auth", authTestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", readinessRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", documentationRoutes);
app.use("/api", technologyRoutes);
app.use("/api", rescueRequestRoutes);
app.use("/api", projectMemberRoutes);
app.use("/api", taskRoutes);
app.use("/api", issueRoutes);
app.use("/api", progressUpdateRoutes);
app.use("/api", reviewRoutes);
app.use("/api", recoveryRoutes);
app.use("/api", notificationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", refreshRoutes);
app.use("/api/auth", logoutRoutes);
app.use("/api/auth", forgotPasswordRoutes);

app.use(errorHandler);

export default app;