import { AuthService } from "./auth.service";
import { ProjectService } from "./project.service";

export const authService = AuthService.getInstance();
export const projectService = ProjectService.getInstance();
