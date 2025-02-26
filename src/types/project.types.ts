export type Project = {
  _id: string;
  name: string;
  dataInfo?: Record<string, unknown>;
  user: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectDto = {
  name: string;
  userId: string;
  dataInfo?: Record<string, unknown>;
};

export type UpdateProjectDto = {
  name?: string;
  dataInfo?: Record<string, unknown>;
};

export type PartialProjectData = {
  name: string;
  dataInfo?: Record<string, unknown>;
};

export type ProjectDataInfo = {
  name: string;
  [key: string]: unknown;
};
export interface ProjectDataItem {
  objectId?: string;
  apiUrl?: string;
  JSONPath?: string;
  "x-api-key"?: string;

  [key: string]: unknown;
}

export type FormattedProject = {
  [projectName: string]: {
    [akashiObjectName: string]: {
      [key: string]: unknown;
      apiKeyExample?: {
        apiUrl: string;
        JSONPath?: string;
        "x-api-key"?: string;
        dataReturn?: unknown;
      };
    };
  };
};
