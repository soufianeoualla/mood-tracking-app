import api from "@/config/axiosInstance";
import { PasswordResetSchemaType } from "@/schemas/auth.schema";

const resetPasswordService = async (data:PasswordResetSchemaType) => {
  const response = await api.post("/auth/reset-password", data);
  return response.data;
};
export default resetPasswordService;
