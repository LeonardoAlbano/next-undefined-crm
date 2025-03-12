import { api } from "./api-client";
import { type Client, getClients } from "./clients";

export interface Project {
  id: number
  clientId: number
  clientName: string
  name: string
  link?: string
  status?: string
  value?: number
  startDate?: string
  endDate?: string
}

export interface CreateProjectRequest {
  clientId: number
  name: string
  link?: string
  status?: string
  value?: number
  startDate?: string
  endDate?: string
}

export async function getProjects(): Promise<Project[]> {
  return await api.get("projects").json<Project[]>();
}

export async function createProject(data: CreateProjectRequest): Promise<Project> {
  return await api
    .post("projects", {
      json: data,
    })
    .json<Project>();
}

export async function updateProject(id: number, data: CreateProjectRequest): Promise<Project> {
  return await api
    .put(`projects/${id}`, {
      json: data,
    })
    .json<Project>();
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`projects/${id}`);
}

export async function getUserClients(): Promise<Client[]> {
  return await getClients();
}
