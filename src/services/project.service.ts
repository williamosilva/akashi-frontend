import { ApiService } from "./api.service";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectDataInfo,
} from "@/types/project.types";

export class ProjectService extends ApiService {
  private static instance: ProjectService;

  private constructor() {
    super();
  }

  public static getInstance(): ProjectService {
    if (!ProjectService.instance) {
      ProjectService.instance = new ProjectService();
    }
    return ProjectService.instance;
  }

  private getUserIdFromStorage(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("userId");
  }

  // Cria um novo projeto
  public async createProject(data: CreateProjectDto): Promise<Project> {
    const userId = this.getUserIdFromStorage();
    if (!userId) {
      throw new Error("User ID not found in storage");
    }

    const projectData = {
      ...data,
      userId,
      dataInfo: {}, // objeto dataInfo vazio
    };

    console.log("[ProjectService] Creating project:", projectData);

    return this.request<Project>("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projectData),
    });
  }

  // Busca projetos de um usuário
  public async getProjectsByUser(userId: string): Promise<Project[]> {
    console.log("[ProjectService] Fetching user projects:", userId);

    return this.request<Project[]>(`/projects/user/${userId}`);
  }

  // Busca informações de dados de um projeto (com atualização das APIs)
  public async getProjectDataInfo(projectId: string): Promise<ProjectDataInfo> {
    console.log("[ProjectService] Fetching project data info:", projectId);

    return this.request<ProjectDataInfo>(`/projects/${projectId}/data-info`);
  }

  // Atualiza um projeto
  public async updateProject(
    projectId: string,
    data: UpdateProjectDto
  ): Promise<Project> {
    console.log("[ProjectService] Updating project:", projectId, data);

    return this.request<Project>(`/projects/${projectId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  // Deleta um projeto
  public async deleteProject(projectId: string): Promise<{ message: string }> {
    console.log("[ProjectService] Deleting project:", projectId);

    return this.request<{ message: string }>(`/projects/${projectId}`, {
      method: "DELETE",
    });
  }

  // Busca um projeto específico
  public async getProject(projectId: string): Promise<Project> {
    console.log("[ProjectService] Fetching project:", projectId);

    return this.request<Project>(`/projects/${projectId}`);
  }
}
