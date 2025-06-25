import api from "@/config/axiosInstance";

const verifyService = async(token: string) => {
  const response = await api.post("/auth/verify", { token });
  return response.data;
};

export default verifyService;