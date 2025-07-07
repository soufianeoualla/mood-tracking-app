import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { useLogMoodContext } from "@/app/(protected)/_context/log-mood-context";
import FeelingsStep, {
  MAX_FEELINGS,
} from "@/app/(protected)/_components/steps/feeling-step";
import { feelingsTags } from "@/app/(protected)/utils";

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

describe("FeelingsStep", () => {
  const mockSetFeelings = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        feelings: [],
      },
      setFeelings: mockSetFeelings,
      errors: {
        feelings: "",
      },
    });
  });

  test("renders headings and tags", () => {
    render(<FeelingsStep />);

    expect(screen.getByText("How did you feel?")).toBeInTheDocument();
    expect(screen.getByText(/Select up to 3 tags/)).toBeInTheDocument();

    feelingsTags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  test("selects a tag and calls setFeelings", () => {
    render(<FeelingsStep />);

    const firstTag = screen.getByText(feelingsTags[0]);
    fireEvent.click(firstTag);

    expect(mockSetFeelings).toHaveBeenCalledWith(feelingsTags[0].toUpperCase());
  });

  test("disables unchecked tags after selecting 3", () => {
    const selectedFeelings = feelingsTags
      .slice(0, MAX_FEELINGS)
      .map((f) => f.toUpperCase());

    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        feelings: selectedFeelings,
      },
      setFeelings: mockSetFeelings,
      errors: {
        feelings: "",
      },
    });

    render(<FeelingsStep />);


    selectedFeelings.forEach((feeling) => {
      expect(
        screen.getByText(feeling.charAt(0) + feeling.slice(1).toLowerCase())
      ).not.toHaveClass("opacity-50");
    });


    const disabledTags = feelingsTags.filter(
      (tag) => !selectedFeelings.includes(tag.toUpperCase())
    );

    disabledTags.forEach((tag) => {
      const el = screen.getByText(tag);
      expect(el.closest("div")).toHaveClass("opacity-50");
    });
  });

  test("displays error message if provided", () => {
    (useLogMoodContext as unknown as Mock).mockReturnValue({
      data: {
        feelings: [],
      },
      setFeelings: mockSetFeelings,
      errors: {
        feelings: "Please select at least one feeling",
      },
    });

    render(<FeelingsStep />);

    expect(
      screen.getByText("Please select at least one feeling")
    ).toBeInTheDocument();
  });
});
