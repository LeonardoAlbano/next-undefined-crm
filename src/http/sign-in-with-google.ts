import { api } from "./api-client";

interface SignInWithGoogleParams {
  token: string
}

interface SignInWithGoogleResponse {
  email: string
  name: string
  accessToken: string
}

export async function signInWithGoogle({ token }: SignInWithGoogleParams) {
  const response = await api
    .post("users/oauth/google", {
      json: {
        token,
      },
    })
    .json<SignInWithGoogleResponse>();

  return {
    token: response.accessToken,
  };
}

