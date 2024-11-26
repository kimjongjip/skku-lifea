import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GroupMainPage from "@/pages/GroupMainPage";
import "@testing-library/jest-dom";

describe("GroupMainPage", () => {
  const renderGroupMainPage = () => {
    return render(
      <MemoryRouter>
        <GroupMainPage />
      </MemoryRouter>
    );
  };

  test("renders header and navigation components", () => {
    renderGroupMainPage();
    // 로고 이미지로 헤더 존재 확인
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    // 네비게이션 탭 확인
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  test("displays initial group information correctly", () => {
    renderGroupMainPage();
    
    // 그룹 기본 정보 확인
    expect(screen.getByText("모임 이름")).toBeInTheDocument();
    expect(screen.getByText("모임 소개문")).toBeInTheDocument();
    
    // 프로필 이미지 확인 (Avatar 컴포넌트)
    const avatars = screen.getAllByRole("img");
    expect(avatars[1]).toBeInTheDocument(); // 첫 번째는 로고, 두 번째가 그룹 프로필
  });

  test("renders statistics section", () => {
    renderGroupMainPage();
    
    expect(screen.getByText("통계치")).toBeInTheDocument();
    expect(screen.getByText("통계치 부분")).toBeInTheDocument();
  });

  test("renders correct number of group members", () => {
    renderGroupMainPage();
    
    // 멤버 섹션 제목 확인
    expect(screen.getByText("모임원")).toBeInTheDocument();
    
    // 각 사용자 이름이 표시되는지 확인
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(`user${i}`)).toBeInTheDocument();
    }

    // Avatar 이미지 개수 확인 (로고 1개 + 그룹 프로필 1개 + 멤버 9개 = 11개)
    const avatarImages = screen.getAllByRole("img");
    expect(avatarImages).toHaveLength(11);
  });

  test("grid layout for members has correct styling", () => {
    renderGroupMainPage();
    
    const memberGrid = screen.getByText("user1").closest("div").parentElement;
    const computedStyle = window.getComputedStyle(memberGrid);
    expect(memberGrid).toHaveStyle({
      display: "grid",
      rowGap: "15px",
      columnGap: "5px"
    });
  });

  test("member cards have correct dimensions", () => {
    renderGroupMainPage();
    
    const memberCard = screen.getByText("user1").closest("div");
    expect(memberCard).toHaveStyle({
      width: "85px",
      height: "100px",
      textAlign: "center"
    });
  });

  test("page layout has correct structure", () => {
    renderGroupMainPage();
    
    // 모임 이름을 포함하는 div의 스타일 확인
    const groupInfoContainer = screen.getByText("모임 이름").closest("div").parentElement;
    expect(groupInfoContainer).toHaveStyle({
      display: "flex",
      margin: "0"
    });
  });
});