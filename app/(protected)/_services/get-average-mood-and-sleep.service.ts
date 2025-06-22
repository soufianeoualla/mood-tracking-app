import api from "@/config/axiosInstance";

const getAverageMoodAndSleep = async () => {
  const response = await api.get("/mood/average");
  return response.data;
};

export default getAverageMoodAndSleep;
