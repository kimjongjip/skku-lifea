import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";
import axios from "axios";

// ResizeObserver 모킹
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// 전역 설정
global.ResizeObserver = ResizeObserver;
window.ResizeObserver = ResizeObserver;

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("axios");

// Chart 컴포넌트 모킹 수정
vi.mock("@/components/main/chart", () => ({
  default: () => <div data-testid="chart-component">Chart Component</div>,
}));

import GroupMainPage from "@/pages/GroupMainPage";

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
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("기본 모임 이름")).toBeInTheDocument();
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
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("User1"));

    expect(navigate).toHaveBeenCalledWith(`/member/User1`, {
      state: { users: mockUserInfo },
    });
  });
});