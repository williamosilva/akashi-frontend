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
  dataInfo?: Record<string, any>;
};

export type UpdateProjectDto = {
  name?: string;
  dataInfo?: Record<string, any>;
};

export type ProjectDataInfo = Record<string, any>;
