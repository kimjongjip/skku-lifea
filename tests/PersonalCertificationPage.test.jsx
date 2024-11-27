import { render, screen, waitFor, act } from "@testing-library/react";
import PersonalCertificationPage from "@/pages/PersonalCertificationPage";
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
        name: "Test User",
        id: "1",
        img: "test-image.jpg",
        statusColor: "#C8FFC3",
        date: "2024-11-27"
      }
    })
  };
});

describe("PersonalCertificationPage", () => {
  const mockCertificationData = {
    data: {
      verifications: [
        {
          userName: "Test User",
          certificationDate: "2024-11-27T12:00:00.000Z",
          verificationImage: "test-image.jpg"
        },
        {
          userName: "Other User",
          certificationDate: "2024-11-27T12:00:00.000Z",
          verificationImage: "other-image.jpg"
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
    axios.get.mockResolvedValue(mockCertificationData);

    await act(async () => {
      renderWithRouter(<PersonalCertificationPage />);
    });

    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("2024-11-27")).toBeInTheDocument();
  });

  test("fetches and displays certification data", async () => {
    axios.get.mockResolvedValue(mockCertificationData);

    await act(async () => {
      renderWithRouter(<PersonalCertificationPage />);
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringContaining("/verification/1")
      );
    });
  });

  test("filters certification data correctly", async () => {
    axios.get.mockResolvedValue(mockCertificationData);

    await act(async () => {
      renderWithRouter(<PersonalCertificationPage />);
    });

    await waitFor(() => {
      // 필터링된 데이터가 state에 제대로 설정되었는지 확인
      const certificationImage = screen.getByAltText("이미지");
      expect(certificationImage).toHaveAttribute("src", "test-image.jpg");
    });
  });

  test("displays profile image", async () => {
    axios.get.mockResolvedValue(mockCertificationData);

    await act(async () => {
      renderWithRouter(<PersonalCertificationPage />);
    });

    const profileImage = screen.getByAltText("user");
    expect(profileImage).toBeInTheDocument();
  });

  test("displays certification image", async () => {
    axios.get.mockResolvedValue(mockCertificationData);

    await act(async () => {
      renderWithRouter(<PersonalCertificationPage />);
    });

    const certificationImage = screen.getByAltText("이미지");
    expect(certificationImage).toBeInTheDocument();
    expect(certificationImage).toHaveAttribute("src", "test-image.jpg");
  });
});