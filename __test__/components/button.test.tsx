import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import Button from "@/components/ui/button";

describe("Button component", () => {
  test("renders with correct text and primary variant styles", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button", { name: "Primary" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-blue-600");
  });

  test("renders with secondary variant styles", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button", { name: "Secondary" });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-white");
  });
});
