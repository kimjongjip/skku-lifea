import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { vi } from "vitest";
import Nav from "@/components/common/Nav"; // Nav 컴포넌트의 경로에 맞게 수정하세요
import { expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// useLocation 모킹
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLocation: vi.fn()
  };
});

describe("Nav", () => {
  const renderNav = (initialPath = '/main') => {
    useLocation.mockReturnValue({ pathname: initialPath });
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Nav />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("모든 네비게이션 탭을 렌더링한다", () => {
    renderNav();
    
    expect(screen.getByRole("tab", { name: /메인/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /인증/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /벌칙/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /모임관리/i })).toBeInTheDocument();
  });

  it("location에 따라 초기 탭 값이 설정된다", () => {
    renderNav('/certificate');
    
    const certificateTab = screen.getByRole("tab", { name: /인증/i });
    expect(certificateTab).toHaveAttribute("aria-selected", "true");
  });

  it("탭을 클릭하면 선택된 탭이 변경된다", () => {
    renderNav();
    
    const penaltyTab = screen.getByRole("tab", { name: /벌칙/i });
    fireEvent.click(penaltyTab);
    
    expect(penaltyTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /메인/i })).toHaveAttribute("aria-selected", "false");
  });

  it("탭이 올바른 라우팅 링크를 가지고 있다", () => {
    renderNav();
    
    expect(screen.getByRole("tab", { name: /메인/i })).toHaveAttribute("href", "/main");
    expect(screen.getByRole("tab", { name: /인증/i })).toHaveAttribute("href", "/certificate");
    expect(screen.getByRole("tab", { name: /벌칙/i })).toHaveAttribute("href", "/penalty");
    expect(screen.getByRole("tab", { name: /모임관리/i })).toHaveAttribute("href", "/management");
  });

  it("다른 경로에 대해 올바른 초기 탭이 설정된다", () => {
    const routes = [
      { path: '/main', expectedTab: '메인' },
      { path: '/certificate', expectedTab: '인증' },
      { path: '/penalty', expectedTab: '벌칙' },
      { path: '/management', expectedTab: '모임관리' }
    ];

    routes.forEach(({ path, expectedTab }) => {
      useLocation.mockReturnValue({ pathname: path });
      const { unmount } = renderNav(path);
      
      const tab = screen.getByRole("tab", { name: expectedTab });
      expect(tab).toHaveAttribute("aria-selected", "true");
      
      unmount();
    });
  });

  it("탭 사이를 이동할 때 선택 상태를 유지한다", () => {
    renderNav();
    
    // 벌칙 탭 클릭
    const penaltyTab = screen.getByRole("tab", { name: /벌칙/i });
    fireEvent.click(penaltyTab);
    expect(penaltyTab).toHaveAttribute("aria-selected", "true");
    
    // 인증 탭 클릭
    const certTab = screen.getByRole("tab", { name: /인증/i });
    fireEvent.click(certTab);
    expect(certTab).toHaveAttribute("aria-selected", "true");
    expect(penaltyTab).toHaveAttribute("aria-selected", "false");
  });
});
