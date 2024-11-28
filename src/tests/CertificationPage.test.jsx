import { render, screen, waitFor, act } from "@testing-library/react";
import CertificationPage from "@/pages/CertificationPage";
import axios from "axios";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

vi.mock("axios");

describe("CertificationPage", () => {
  const mockUserInfo = {
    data: {
      userClass: [{
        classId: "class123",
        classMember: [
          { id: 1, name: "User1" },
          { id: 2, name: "User2" }
        ]
      }]
    }
  };

  const mockCertifications = {
    data: {
      verifications: [
        {
          verificationId: "ver1",
          userName: "User1",
          yesVote: 3,
          noVote: 1,
          verificationImage: "image-url"
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

  test("renders header and navigation tabs", async () => {
    axios.get.mockResolvedValueOnce(mockUserInfo)
         .mockResolvedValue(mockCertifications);

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    expect(screen.getByText("스꾸라이프")).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "메인" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "인증" })).toBeInTheDocument();
  });

  test("fetches and displays user class information", async () => {
    axios.get.mockResolvedValueOnce(mockUserInfo)
         .mockResolvedValue(mockCertifications);

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/user/info"),
        expect.any(Object)
      );
    });
  });

  test("fetches and displays certification data", async () => {
    axios.get.mockResolvedValueOnce(mockUserInfo)
         .mockResolvedValue(mockCertifications);

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    await waitFor(() => {
      const userElements = screen.getAllByText("User1");
      expect(userElements.length).toBeGreaterThan(0);
    });
  });

  test("handles API error for user info", async () => {
    const error = new Error("Failed to fetch user info");
    axios.get.mockRejectedValueOnce(error);

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching user info:",
        error
      );
    });
  });

  test("handles API error for certification data", async () => {
    axios.get.mockResolvedValueOnce(mockUserInfo)
         .mockRejectedValue(new Error("Failed to fetch certification"));

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith(
        "Error fetching certification data:",
        expect.any(Error)
      );
    });
  });

  test("displays certification status correctly", async () => {
    axios.get.mockResolvedValueOnce(mockUserInfo)
         .mockResolvedValue(mockCertifications);

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    await waitFor(() => {
      const successElements = screen.getAllByText("인증 성공");
      expect(successElements.length).toBeGreaterThan(0);
      const certificationContainer = successElements[0].closest('div[style*="background-color"]');
      expect(certificationContainer).toHaveStyle({
        backgroundColor: 'rgb(200, 255, 195)'
      });
    });
  });

  test("formats dates correctly", async () => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    
    axios.get.mockResolvedValueOnce(mockUserInfo)
         .mockResolvedValue(mockCertifications);

    await act(async () => {
      renderWithRouter(<CertificationPage />);
    });

    await waitFor(() => {
      const dateElements = screen.getAllByText(formattedDate);
      expect(dateElements.length).toBeGreaterThan(0);
    });
  });
});