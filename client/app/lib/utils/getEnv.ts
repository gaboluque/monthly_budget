
export const getEnv = () => {
  return {
    BASE_API_URL: typeof window !== "undefined" ? window.process.env.BASE_API_URL : process.env.BASE_API_URL,
  };
};

