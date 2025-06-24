import api from "@/config/axiosInstance";

const getAverageMoodAndSleepService = async () => {
  const response = await api.get("/mood/average");
  return response.data;
};

export default getAverageMoodAndSleepService;
