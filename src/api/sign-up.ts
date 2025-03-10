import { api } from "@/lib/axios";

export interface SignUpBody {
    name: string;
    email: string;
    password: string;
}

export async function signUp({ email, password, name }: SignUpBody) {
    await api.post("/users", { email, password, name });
}
