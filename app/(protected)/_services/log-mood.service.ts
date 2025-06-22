import api from "@/config/axiosInstance";
import { MoodEntrySchemaType } from "@/schemas/mood.entry";


const logMoodService = (data: MoodEntrySchemaType) => {
  const response = api.post("/mood", data);
  return response;
};

export default logMoodService;
