import { ApiService } from "./api.service";
import {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectDataItem,
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

  // Busca projetos de um usuário
  public async getProjectsByUser(userId: string): Promise<Project[]> {
    console.log("[ProjectService] Fetching user projects:", userId);

    return this.request<Project[]>(`/projects/user/${userId}`);
  }

  // Busca informações de dados de um projeto (com atualização das APIs)
  public async getProjectDataInfo(projectId: string): Promise<ProjectDataInfo> {
    console.log("[ProjectService] Fetching project data info:", projectId);

    return this.request<ProjectDataInfo>(`/projects/${projectId}/datainfo`);
  }

  public async createProject(data: CreateProjectDto): Promise<Project> {
    const userId = this.getUserIdFromStorage();
    if (!userId) {
      throw new Error("User ID not found in storage");
    }

    return this.request<Project>("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        userId,
      }),
    });
  }

  public async updateDataInfoItem(
    projectId: string,
    itemKey: string,
    itemData: ProjectDataItem
  ): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}/datainfo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataInfo: {
          [itemKey]: itemData,
        },
      }),
    });
  }

  public async deleteDataInfoItem(
    projectId: string,
    itemKey: string
  ): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}/datainfo`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deleteKeys: [itemKey],
      }),
    });
  }

  // Busca um projeto específico
  public async getProject(projectId: string): Promise<Project> {
    console.log("[ProjectService] Fetching project:", projectId);

    return this.request<Project>(`/projects/${projectId}`);
  }
}
