import { api } from "./api-client";

export interface Client {
  id: number
  name: string
  surname: string
  email?: string
  phone?: string
}

export interface CreateClientRequest {
  name: string
  surname: string
  email?: string
  phone?: string
}

export async function getClients(): Promise<Client[]> {
  return await api.get("clients").json<Client[]>();
}

export async function createClient(data: CreateClientRequest): Promise<Client> {
  return await api
    .post("clients", {
      json: data,
    })
    .json<Client>();
}

export async function updateClient(id: number, data: CreateClientRequest): Promise<Client> {
  return await api
    .put(`clients/${id}`, {
      json: data,
    })
    .json<Client>();
}

export async function deleteClient(id: number): Promise<void> {
  await api.delete(`clients/${id}`);
}
