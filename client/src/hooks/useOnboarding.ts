import { useEffect } from "react";
import { useState } from "react";
import { Category } from "../lib/types/categories";
import { categoriesApi } from "../lib/api/categories";
import { accountsApi } from "../lib/api/accounts";
import { usersApi } from "../lib/api/users";
import { OnboardingData } from "../lib/types/users";
import { ui } from "../lib/ui";
import { useNavigate } from "react-router";

export function useOnboarding() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [accountTypes, setAccountTypes] = useState<string[]>([]);
  const [onboardingSubmitting, setOnboardingSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await categoriesApi.fetchAll();
      setCategories(response);
    };

    const fetchAccountTypes = async () => {
      const response = await accountsApi.fetchAccountTypes();
      setAccountTypes(response);
    };

    fetchCategories();
    fetchAccountTypes();
  }, []);

  const submitOnboarding = async (data: OnboardingData) => {
    try {
      setOnboardingSubmitting(true);
      await usersApi.onboarding(data);

      navigate("/dashboard");

      return true;
    } catch (error) {
      ui.notify({
        message: "Failed to submit onboarding",
        type: "error",
        error: error as Error,
      });
      return false;
    } finally {
      setOnboardingSubmitting(false);
    }
  };

  return {
    categories,
    accountTypes,
    submitOnboarding,
    onboardingSubmitting,
  };
}
