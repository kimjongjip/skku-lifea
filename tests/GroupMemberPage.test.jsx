import { render, screen, waitFor, act } from "@testing-library/react";
import GroupMemberPage from "@/pages/GroupMemberPage";
import axios from "axios";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({
      state: {
        users: {
          userImage: "test-image.jpg",
          userName: "Test User",
          userClass: [{
            classId: "class123"
          }]
        }
      }
    })
  };
});

describe("GroupMemberPage", () => {
  const mockVerificationData = {
    data: {
      verifications: [
        {
          verificationId: "ver1",
          verificationImage: "test-verification-image.jpg",
          yesVote: 3,
          noVote: 1
        }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (component) => {
    return render(
      <MemoryRouter>
        {component}
      </MemoryRouter>
    );
  };

  test("renders user information correctly", async () => {
    axios.get.mockResolvedValue(mockVerificationData);

    await act(async () => {
      renderWithRouter(<GroupMemberPage />);
    });

    const userName = screen.getByText("Test User");
    expect(userName).toBeInTheDocument();
    
    const images = screen.getAllByAltText("user");
    expect(images[0]).toHaveAttribute("src", "test-image.jpg");
    expect(images[0]).toHaveStyle({
      width: "80px",
      height: "80px"
    });
  });

  test("fetches and displays verification data", async () => {
    axios.get.mockResolvedValue(mockVerificationData);

    await act(async () => {
      renderWithRouter(<GroupMemberPage />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/verification/class123/"),
        expect.any(Object)
      );
    });
  });

  test("handles API error gracefully", async () => {
    const error = new Error("Failed to fetch verification data");
    axios.get.mockRejectedValue(error);

    await act(async () => {
      renderWithRouter(<GroupMemberPage />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "인증 기록 불러오기 에러:",
        error
      );
    });
  });

  test("displays certification status section", async () => {
    axios.get.mockResolvedValue(mockVerificationData);

    await act(async () => {
      renderWithRouter(<GroupMemberPage />);
    });

    expect(screen.getByText("인증 현황")).toBeInTheDocument();
  });

  test("processes verification data correctly", async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    
    const mockData = {
      data: {
        verifications: [{
          verificationId: "ver1",
          verificationImage: "test-image.jpg",
          status: "success"
        }]
      }
    };

    axios.get.mockResolvedValue(mockData);

    await act(async () => {
      renderWithRouter(<GroupMemberPage />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(6);
    });
  });

  test("applies correct layout styles", async () => {
    axios.get.mockResolvedValue(mockVerificationData);

    await act(async () => {
      renderWithRouter(<GroupMemberPage />);
    });

    const mainContainer = screen.getByText("Test User").closest('div[style*="display: flex"]');
    const containerStyle = window.getComputedStyle(mainContainer);
    expect(containerStyle.getPropertyValue("display")).toBe("flex");
    expect(containerStyle.getPropertyValue("width")).toBe("90%");
  });
});