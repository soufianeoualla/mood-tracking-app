import api from "@/config/axiosInstance";
import { AuthSchemaType } from "@/schemas/auth.schema";

const loginService = async (data: AuthSchemaType) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};
export default loginService;
