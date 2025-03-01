import { ApiService } from "./api.service";
import {
  Project,
  CreateProjectDto,
  ProjectDataInfo,
  FormattedProject,
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

  public async getProjectsByUser(userId: string): Promise<Project[]> {
    return this.request<Project[]>(`/projects/user/${userId}`);
  }

  public async getProjectDataInfo(projectId: string): Promise<ProjectDataInfo> {
    return this.request<ProjectDataInfo>(`/projects/${projectId}/datainfo`);
  }

  public async createProject(data: CreateProjectDto): Promise<Project> {
    if (!data.userId) {
      throw new Error("User ID is required");
    }

    return this.request<Project>("/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  public async deleteDataInfoItem(
    projectId: string,
    entryId: string
  ): Promise<{
    message: string;
    entryId: string;
    project: Project;
  }> {
    return this.request<{
      message: string;
      entryId: string;
      project: Project;
    }>(`/projects/${projectId}/dataentry/${entryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async deleteProject(projectId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/projects/${projectId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  public async addDataInfoItem(
    projectId: string,
    itemData: Record<string, unknown>
  ): Promise<{
    entryId: string;
    entry: Record<string, unknown>;
    project: Project;
  }> {
    return this.request<{
      entryId: string;
      entry: Record<string, unknown>;
      project: Project;
    }>(`/projects/${projectId}/dataentry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
  }

  public async updateDataInfoItem(
    projectId: string,
    entryId: string,
    itemData: Record<string, unknown>
  ): Promise<Project> {
    return this.request<Project>(
      `/projects/${projectId}/datainfo/entry/${entryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      }
    );
  }

  public async getProject(projectId: string): Promise<Project> {
    return this.request<Project>(`/projects/${projectId}`);
  }

  public async getFormattedProject(
    projectId: string
  ): Promise<FormattedProject> {
    return this.request<FormattedProject>(`/projects/${projectId}/formatted`);
  }
}
