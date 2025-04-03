export const getEnv = () => {
  return {
    BASE_API_URL: import.meta.env.VITE_BASE_API_URL || '',
  };
};

