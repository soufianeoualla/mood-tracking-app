import api from "@/config/axiosInstance";

const getCurrentMoodService = async () => {
  const response = await api.get("/mood");
  return response.data;
};

export default getCurrentMoodService;
