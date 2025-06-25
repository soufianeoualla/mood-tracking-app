import api from "@/config/axiosInstance";

const forgotPasswordService = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};
export default forgotPasswordService;