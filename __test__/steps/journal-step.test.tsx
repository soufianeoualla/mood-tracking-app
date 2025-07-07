import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi, beforeEach, Mock } from "vitest";

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

import JournalStep from "@/app/(protected)/_components/steps/journal-step";
import { useLogMoodContext } from "@/app/(protected)/_context/log-mood-context";
import { MIN_JOURNAL_LENGTH } from "@/app/(protected)/_components/log-mood";

const mockSetComment = vi.fn();

describe("JournalStep", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        comment: "",
        feelings: [],
        mood: 0,
        sleepHours: 0,
      },
      setComment: mockSetComment,
      errors: {
        comment: "",
      },
    });
  });

  test("renders with the existing comment value", () => {
    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        comment: "Existing journal entry",
        feelings: [],
        mood: 2,
        sleepHours: 6,
      },
      setComment: mockSetComment,
      errors: {
        comment: "",
      },
    });

    render(<JournalStep />);
    const textarea = screen.getByPlaceholderText("Today, I felt…");
    expect(textarea).toHaveValue("Existing journal entry");
  });

  test("calls setComment on textarea change", () => {
    render(<JournalStep />);
    const textarea = screen.getByPlaceholderText("Today, I felt…");
    fireEvent.change(textarea, { target: { value: "I had a good day" } });

    expect(mockSetComment).toHaveBeenCalledWith("I had a good day");
  });

  test("shows error message if comment is less than 10 characters", () => {
    const shortComment = "Too short";
    const errorMessage = `Please write a few words about your day before continuing. Minimum ${MIN_JOURNAL_LENGTH} characters required.`;

    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        comment: shortComment,
        feelings: [],
        mood: 3,
        sleepHours: 8,
      },
      setComment: mockSetComment,
      errors: {
        comment: errorMessage,
      },
    });

    render(<JournalStep />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
