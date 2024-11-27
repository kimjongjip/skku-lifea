import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import axios from "axios";

// ResizeObserver Mock
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

global.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;

const navigate = vi.fn();

// Ensure the alias is correctly resolved
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("axios");

// Update the path to match the exact casing
vi.mock("@/components/main/chart", () => ({
  default: () => <div data-testid="chart-component">Chart Component</div>,
}));

import GroupMainPage from "@/pages/GroupMainPage";

// Mock getBBox if necessary
beforeAll(() => {
  SVGElement.prototype.getBBox = () => ({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });
});

describe("GroupMainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("유저 정보와 통계 데이터를 가져와서 표시한다", async () => {
    const mockUserInfo = {
      userClass: [
        {
          classImage: "classImageURL",
          className: "모임 이름",
          classDescription: "모임 소개문",
          classMember: [
            {
              email: "user1@example.com",
              userName: "User1",
              userImage: "userImageURL1",
            },
            {
              email: "user2@example.com",
              userName: "User2",
              userImage: "userImageURL2",
            },
          ],
        },
      ],
    };

    const mockStatistics = {
      chart: [
        { date: "2023-01-01", value: 10 },
        { date: "2023-01-02", value: 15 },
      ],
    };

    axios.get
      .mockResolvedValueOnce({ data: mockUserInfo })
      .mockResolvedValueOnce({ data: mockStatistics });

    render(
      <MemoryRouter>
        <GroupMainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("모임 이름")).toBeInTheDocument();
    expect(screen.getByText("모임 소개문")).toBeInTheDocument();
    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("User2")).toBeInTheDocument();
    expect(screen.getByTestId("chart-component")).toBeInTheDocument();
  });

  it("API 호출 실패 시 오류를 처리한다", async () => {
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <GroupMainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("기본 모임 이름")).toBeInTheDocument();
    });
  });

  it("모임원을 클릭하면 상세 페이지로 이동한다", async () => {
    const mockUserInfo = {
      userClass: [
        {
          classImage: "classImageURL",
          className: "모임 이름",
          classDescription: "모임 소개문",
          classMember: [
            {
              email: "user1@example.com",
              userName: "User1",
              userImage: "userImageURL1",
            },
          ],
        },
      ],
    };

    axios.get
      .mockResolvedValueOnce({ data: mockUserInfo })
      .mockResolvedValueOnce({ data: { chart: [] } });

    render(
      <MemoryRouter>
        <GroupMainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("User1")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("User1"));

    expect(navigate).toHaveBeenCalledWith(`/member/User1`, {
      state: { users: mockUserInfo },
    });
  });
});