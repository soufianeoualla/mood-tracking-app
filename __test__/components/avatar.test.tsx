import { describe, expect, test, vi } from "vitest";

import { render, screen } from "@testing-library/react";
import Avatar from "@/components/ui/avatar";

vi.mock("next/image", async () => {
  const React = (await vi.importActual("react")) as typeof import("react");
  return {
    default: ({
      src,
      width,
      height,
      alt,
    }: {
      src?: string;
      width?: number;
      height?: number;
      alt?: string;
    }) =>
      React.createElement("img", {
        src: typeof src === "string" ? src : "mocked-avatar",
        width,
        height,
        alt,
      }),
  };
});
vi.mock("@/assets/avatar.svg", () => ({ default: "avatar.svg" }));
describe("Avatar component", () => {
  test("renders with default avatar", () => {
    render(<Avatar />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "avatar.svg");
    expect(img).toHaveAttribute("width", "42");
    expect(img).toHaveAttribute("height", "42");
  });

  test("renders with custom src, alt, and size", () => {
    render(<Avatar src="user.jpg" alt="user" size={64} />);
    const img = screen.getByRole("img");

    expect(img).toHaveAttribute("src", "user.jpg");
    expect(img).toHaveAttribute("alt", "user");
    expect(img).toHaveAttribute("width", "64");
    expect(img).toHaveAttribute("height", "64");
  });
});
