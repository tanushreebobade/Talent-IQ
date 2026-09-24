import axiosInstance from "../lib/axios";

export const getAiHint = async (payload) => {
  const response = await axiosInstance.post("/ai/hint", payload);
  return response.data;
};

export const explainAiError = async (payload) => {
  const response = await axiosInstance.post("/ai/explain-error", payload);
  return response.data;
};

