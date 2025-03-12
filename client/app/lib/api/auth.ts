import { apiClient } from "./client";

type loginBody = {
  user: {
    email: string;
    password: string;
  };
};
export const login = async (email: string, password: string) => {
  return apiClient.post<loginBody>("/login", {
    user: {
      email,
      password,
    },
  });
};
