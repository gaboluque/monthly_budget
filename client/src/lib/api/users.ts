import { apiClient } from "./client";
import { OnboardingData } from "../types/users";
import { setToken, setUser } from "../utils/auth";


export const usersApi = {
  onboarding: async (data: OnboardingData) => {
    const response = await apiClient.post("/users/onboarding", {
      onboarding: data,
    });

    if(response.success) {
      await usersApi.me();
    }

    return response;
  },
  me: async () => {
    const response = await apiClient.get("/users/me");

    if(response.jwt) {
      setToken(response.jwt);
    }

    if(response.user) {
      setUser(response.user);
    }

    return response;
  },
};
