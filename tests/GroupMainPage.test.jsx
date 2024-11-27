// tests/GroupMainPage.test.jsx

import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // `useNavigate`를 임포트하지 않습니다.
import { vi } from "vitest";
import "@testing-library/jest-dom";
import axios from "axios";

// `useNavigate` 모킹을 위한 네비게이트 함수 생성
const navigate = vi.fn();

// `react-router-dom` 모듈 모킹
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigate, // `useNavigate`를 모의 함수로 모킹
  };
});

// `axios` 모킹
vi.mock("axios");

// `Chart` 컴포넌트 모킹
vi.mock("../src/components/main/chart", () => ({
  default: () => <div>Chart Component</div>,
}));

// 이제 컴포넌트를 임포트합니다. 모킹이 완료된 후에 임포트해야 합니다.
import GroupMainPage from "../src/pages/GroupMainPage"; // 컴포넌트 경로에 맞게 수정하세요

describe("GroupMainPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("초기에 로딩 상태를 표시한다", () => {
    render(
      <MemoryRouter>
        <GroupMainPage />
      </MemoryRouter>
    );

    expect(screen.getByText("로딩 중...")).toBeInTheDocument();
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
      .mockResolvedValueOnce({ data: mockUserInfo }) // 첫 번째 API 호출 (getUserInfo)
      .mockResolvedValueOnce({ data: mockStatistics }); // 두 번째 API 호출 (getClassStatistics)

    await act(async () => {
      render(
        <MemoryRouter>
          <GroupMainPage />
        </MemoryRouter>
      );
    });

    // 로딩이 끝날 때까지 기다립니다.
    await waitFor(() => {
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });

    // 모임 정보가 표시되는지 확인합니다.
    expect(screen.getByText("모임 이름")).toBeInTheDocument();
    expect(screen.getByText("모임 소개문")).toBeInTheDocument();

    // 모임원이 표시되는지 확인합니다.
    expect(screen.getByText("User1")).toBeInTheDocument();
    expect(screen.getByText("User2")).toBeInTheDocument();

    // 차트 컴포넌트가 렌더링되는지 확인합니다.
    expect(screen.getByText("Chart Component")).toBeInTheDocument();
  });

  it("API 호출 실패 시 오류를 처리한다", async () => {
    // getUserInfo 호출 시 에러 발생
    axios.get.mockRejectedValueOnce(new Error("Network Error"));

    await act(async () => {
      render(
        <MemoryRouter>
          <GroupMainPage />
        </MemoryRouter>
      );
    });

    // 로딩이 끝날 때까지 기다립니다.
    await waitFor(() => {
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });

    // 기본 모임 정보가 표시되는지 확인합니다.
    expect(screen.getByText("기본 모임 이름")).toBeInTheDocument();
    expect(screen.getByText("기본 모임 설명")).toBeInTheDocument();
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

    const mockStatistics = {
      chart: [],
    };

    axios.get
      .mockResolvedValueOnce({ data: mockUserInfo })
      .mockResolvedValueOnce({ data: mockStatistics });

    await act(async () => {
      render(
        <MemoryRouter>
          <GroupMainPage />
        </MemoryRouter>
      );
    });

    // 로딩이 끝날 때까지 기다립니다.
    await waitFor(() => {
      expect(screen.queryByText("로딩 중...")).not.toBeInTheDocument();
    });

    // 모임원을 클릭합니다.
    fireEvent.click(screen.getByText("User1"));

    // navigate 함수가 올바른 인자로 호출되었는지 확인합니다.
    expect(navigate).toHaveBeenCalledWith(`/member/User1`, {
      state: { users: mockUserInfo },
    });
  });
});
