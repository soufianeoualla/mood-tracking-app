import api from "@/config/axiosInstance";

const onboardingService = async (data: { name: string; cover?: string }) => {
  const response = await api.post("/onboarding", data);
  return response.data;
};

export default onboardingService;
