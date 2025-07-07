import SleepStep from "@/app/(protected)/_components/steps/sleep-step";
import { useLogMoodContext } from "@/app/(protected)/_context/log-mood-context";
import { sleepOptions } from "@/app/(protected)/utils";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, Mock, test, vi } from "vitest";

// Mock next/image to avoid SSR issues
vi.mock("next/image", async () => {
  const React = await vi.importActual("react");
  return {
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
      <img {...props} />
    ),
  };
});

vi.mock("@/app/(protected)/_context/log-mood-context", () => ({
  useLogMoodContext: vi.fn(),
}));

const mockSetSleep = vi.fn();

describe("SleepStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        comment: "",
        feelings: [],
        mood: 0,
        sleepHours: 0,
      },
      setSleepHours: mockSetSleep,
      errors: {
        comment: "",
      },
    });
  });

  test("renders sleep question and input", () => {
    render(<SleepStep />);
    expect(
      screen.getByText("How many hours did you sleep last night?")
    ).toBeInTheDocument();
  });

  test("renders sleep options with correct values", () => {
    render(<SleepStep />);

    sleepOptions.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  test("selects a sleep option and calls setSleep", () => {
    render(<SleepStep />);
    const { label, value } = sleepOptions[0];
    const sleepOption = screen.getByText(label);
    fireEvent.click(sleepOption);

    expect(mockSetSleep).toHaveBeenCalledWith(value);
  });

  test("shows error message if sleep has error", () => {
    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        sleepHours: 0,
        comment: "",
        feelings: [],
        mood: 0,
      },
      setSleepHours: mockSetSleep,
      errors: {
        sleepHours: "Sleep hours is required",
      },
    });

    render(<SleepStep />);
    expect(screen.getByText("Sleep hours is required")).toBeInTheDocument();
  });
});
