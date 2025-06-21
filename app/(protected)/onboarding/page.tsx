import Image from "next/image";
import logo from "@/assets/logo.svg";
import OnboardingForm from "./_components/onboarding-form";
import { OnboardingGuard } from "@/components/auth-wrappers";

const page = () => {
  return (
    <OnboardingGuard>
      <div className="flex gap-y-12 flex-col items-center  pt-20 custom-linear-gradiant min-h-screen">
        <Image src={logo} alt="mood tracker" />
        <OnboardingForm />
      </div>
    </OnboardingGuard>
  );
};

export default page;
