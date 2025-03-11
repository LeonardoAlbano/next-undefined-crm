import { api } from "./api-client";
 
 interface GetProfileResponse {
   user: {
     id: string
     name: string | null
     email: string
   }
 }
 
 export async function getProfile() {
   const result = await api.get("users").json<GetProfileResponse>();
 
   return result;
 }