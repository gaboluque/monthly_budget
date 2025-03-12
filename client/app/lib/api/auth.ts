import { apiClient } from "./client";

type loginBody = {
  user: {
    email: string;
    password: string;
  };
};

export const authApi = {
  login: async (email: string, password: string) =>
    apiClient.post<loginBody>("/login", {
      user: { email, password },
    }),
};
