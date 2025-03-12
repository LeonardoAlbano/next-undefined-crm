import { api } from "./api-client";

interface SignInWithPasswordParams {
  email: string
  password: string
}

interface SignInWithPasswordResponse {
  email: string
  name: string
  accessToken: string
}

export async function signInWithPassword({ email, password }: SignInWithPasswordParams) {
  const response = await api
    .post("users/login", {
      json: {
        email,
        password,
      },
    })
    .json<SignInWithPasswordResponse>();

  return {
    token: response.accessToken,
  };
}
