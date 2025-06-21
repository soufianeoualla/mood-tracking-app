"use client";
import useAuthStore from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { initializeAuth, isLoading, user, isInitialized } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };

    initialize();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.push("/login");
      return;
    }

    if (user && user.onboardingComplete === false) {
      router.push("/onboarding");
      return;
    }
  }, [isInitialized, user, router]);

  if (isLoading || !isInitialized) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

const AuthPageGuard = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { initializeAuth, isLoading, user, isInitialized } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
      }
    };

    initialize();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isInitialized) return;

    if (user) {
      if (user.onboardingComplete === false) {
        router.push("/onboarding");
      } else if (user.onboardingComplete === true) {
        router.push("/");
      }
    }
  }, [isInitialized, user, router]);

  if (isLoading || !isInitialized) {
    return <div>Loading...</div>;
  }

  if (user) {
    return null;
  }

  return <>{children}</>;
};

const OnboardingGuard = ({ children }: { children?: React.ReactNode }) => {
  const router = useRouter();
  const { isLoading, user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (user && user.onboardingComplete === true) {
      router.push("/");
      return;
    }
  }, [isInitialized, user, router]);

  if (isLoading || !isInitialized) {
    return <div>Loading...</div>;
  }

  if (!user || user.onboardingComplete === true) {
    return null;
  }

  return <>{children}</>;
};

export { ProtectedRoute, AuthPageGuard, OnboardingGuard };
export default ProtectedRoute;
