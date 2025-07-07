import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UserProfileForm from "@/components/profile-form";

vi.mock("@/lib/upload.service", () => ({
  default: vi.fn(),
}));

import uploadServiceModule from "@/lib/upload.service";
const uploadService = uploadServiceModule as Mock;

const renderForm = (props = {}) => {
  const defaultProps = {
    onSubmit: vi.fn(),
    defaultValues: { name: "", cover: undefined },
    ...props,
  };
  return render(<UserProfileForm {...defaultProps} />);
};

describe("UserProfileForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form with title and description", () => {
    renderForm();
    expect(screen.getByText("Personalize your experience")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Add your name and a profile picture to make Mood yours."
      )
    ).toBeInTheDocument();
  });

  test("shows validation error when name is empty", async () => {
    renderForm();
    fireEvent.click(screen.getByRole("button", { name: "Start Tracking" }));
    await screen.findByText(/name is required/i);
  });

  test("calls onSubmit with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    const nameInput = screen.getByPlaceholderText("Jane Appleseed");
    await user.clear(nameInput);
    await user.type(nameInput, "Jane");

    const submitButton = screen.getByRole("button", { name: "Start Tracking" });
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        { name: "Jane", cover: undefined },
        expect.any(Object)
      );
    });
  });

  test("calls onSubmit with pre-filled valid data", async () => {
    const onSubmit = vi.fn();
    renderForm({
      onSubmit,
      defaultValues: {
        name: "Jane",
        cover:
          "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
    });

    const submitButton = screen.getByRole("button", { name: "Start Tracking" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        {
          name: "Jane",
          cover:
            "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
        },
        expect.any(Object)
      );
    });
  });

  test("uploads image successfully and shows success message", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const file = new File(["(image)"], "avatar.png", { type: "image/png" });

    uploadService.mockResolvedValueOnce({
      secure_url: "http://mocked-image-url.com/image.png",
    });

    renderForm({ onSubmit });

    const uploadButton = screen.getByRole("button", { name: /upload/i });
    await user.click(uploadButton);

    const fileInput = screen.getByLabelText(/upload image/i);
    await user.upload(fileInput, file);

    await waitFor(() => {
      expect(screen.getByText(/upload successful/i)).toBeInTheDocument();
    });

    expect(uploadService).toHaveBeenCalledWith(file);
  });
});
