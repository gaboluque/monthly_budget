const BASE_URL = "http://localhost:3001/api/v1";

const request = async (url: string, options?: RequestInit) => {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers || {}),
    };

    const response = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const apiClient = {
  get: async (url: string) => request(url),

  post: async <T>(url: string, data?: T) =>
    request(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  patch: async <T>(url: string, data: T) =>
    request(url, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: async (url: string) =>
    request(url, {
      method: "DELETE",
    }),
};
