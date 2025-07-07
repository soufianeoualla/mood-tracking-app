import MoodStep from "@/app/(protected)/_components/steps/mood-step";
import { useLogMoodContext } from "@/app/(protected)/_context/log-mood-context";
import { MOODS_CONFIG } from "@/app/(protected)/utils";
import { fireEvent, render, screen } from "@testing-library/react";

import { beforeEach, describe, vi, Mock, test, expect } from "vitest";

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

const mockSetMood = vi.fn();

describe("MoodStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        comment: "",
        feelings: [],
        mood: 0,
        sleepHours: 0,
      },
      setMood: mockSetMood,
      errors: {
        comment: "",
      },
    });
  });
  test("renders mood question and mood options", () => {
    render(<MoodStep />);
    expect(screen.getByText("How was your mood today?")).toBeInTheDocument();

    MOODS_CONFIG.forEach((mood) => {
      expect(screen.getByText(mood.moodText)).toBeInTheDocument();
    });
  });
  test("selects a mood and calls setMood", () => {
    render(<MoodStep />);
    const { value, moodText } = MOODS_CONFIG[0];

    const moodOption = screen.getByText(moodText);
    fireEvent.click(moodOption);
    expect(mockSetMood).toHaveBeenCalledWith(value);
  });

  test("shows error message if mood has error", () => {
    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        mood: 0,
        comment: "",
        feelings: [],
        sleepHours: 0,
      },
      setMood: mockSetMood,
      errors: {
        mood: "Please select your mood",
      },
    });

    render(<MoodStep />);
    expect(screen.getByText("Please select your mood")).toBeInTheDocument();
  });
});
