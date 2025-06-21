import api from "@/config/axiosInstance";
import { AuthSchemaType } from "@/schemas/auth.schema";

const signUpService = async (data: AuthSchemaType) => {
  const response = await api.post("/auth/signup", data);
  return response.data;
};
export default signUpService;
