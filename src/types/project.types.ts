export type Project = {
  _id: string;
  name: string;
  dataInfo?: Record<string, any>;
  user: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateProjectDto = {
  name: string;
  userId: string;
  dataInfo?: Record<string, any>;
};

export type UpdateProjectDto = {
  name?: string;
  dataInfo?: Record<string, any>;
};

export type PartialProjectData = {
  name: string;
  dataInfo?: Record<string, any>;
};

export type ProjectDataInfo = Record<string, any>;

export interface ProjectDataItem {
  objectId?: string;
  apiUrl?: string;
  JSONPath?: string;
  "x-api-key"?: string;

  [key: string]: any;
}

export type FormattedProject = {
  [projectName: string]: {
    [akashiObjectName: string]: {
      [key: string]: any;
      apiKeyExample?: {
        apiUrl: string;
        JSONPath?: string;
        "x-api-key"?: string;
        dataReturn?: any;
      };
    };
  };
};
