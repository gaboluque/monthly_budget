
export const getEnv = () => {
  console.log(process.env.BASE_API_URL);
  return {
    BASE_API_URL: process.env.BASE_API_URL,
  };
};

