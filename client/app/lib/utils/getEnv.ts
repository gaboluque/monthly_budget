
export const getEnv = () => {
  console.log("getEnv", process.env.BASE_API_URL);

  if (typeof window !== "undefined") {
    console.log("getEnv", window.process.env.BASE_API_URL);
  }

  return {
    BASE_API_URL: process.env.BASE_API_URL,
  };
};

