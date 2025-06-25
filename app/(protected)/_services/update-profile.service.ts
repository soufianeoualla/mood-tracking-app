import api from "@/config/axiosInstance";
import { ProfileSchemaType } from "@/schemas/profile.schema";


const updateProfileService = async (data: ProfileSchemaType) => {
  const response = await api.patch("/profile", data);
  return response.data;
};

export default updateProfileService;
