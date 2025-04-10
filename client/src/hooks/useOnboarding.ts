import { useEffect } from "react";
import { useState } from "react";
import { Category } from "../lib/types/categories";
import { categoriesApi } from "../lib/api/categories";
import { accountsApi } from "../lib/api/accounts";  

export function useOnboarding() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [accountTypes, setAccountTypes] = useState<string[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await categoriesApi.fetchAll();
            setCategories(response);
        }

        const fetchAccountTypes = async () => {
            const response = await accountsApi.fetchAccountTypes();
            setAccountTypes(response);
        }

        fetchCategories();
        fetchAccountTypes();
    }, []);

    return {
        categories,
        accountTypes,
    };
}