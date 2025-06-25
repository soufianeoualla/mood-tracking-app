// hooks/useOnboardingMutation.ts
import { useMutation } from "@tanstack/react-query";
import onboardingService from "../_services/onboarding.service";
import { ProfileSchemaType } from "@/schemas/profile.schema";


export const useOnboardingMutation = () => {
  return useMutation({
    mutationFn: (data: ProfileSchemaType) => onboardingService(data),
  });
};
