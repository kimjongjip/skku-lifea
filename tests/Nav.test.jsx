import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { vi } from "vitest";
import Nav from "../src/components/common/Nav";
import { expect, describe, it, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock useLocation
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

  it("renders all navigation tabs", () => {
    renderNav();
    
    expect(screen.getByRole("tab", { name: /메인/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /인증/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /벌칙/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /모임관리/i })).toBeInTheDocument();
  });

  it("applies correct styles to container", () => {
    const { container } = renderNav();
    
    // 최상위 div를 직접 선택
    const navContainer = container.firstChild;
    
    // width와 height만 테스트
    expect(navContainer).toHaveStyle({
      width: "100%",
      height: "40px"
    });
  });

  it("sets initial tab value based on location", () => {
    renderNav('/certificate');
    
    const certificateTab = screen.getByRole("tab", { name: /인증/i });
    expect(certificateTab).toHaveAttribute("aria-selected", "true");
  });

  it("changes selected tab when clicking", () => {
    renderNav();
    
    const penaltyTab = screen.getByRole("tab", { name: /벌칙/i });
    fireEvent.click(penaltyTab);
    
    expect(penaltyTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: /메인/i })).toHaveAttribute("aria-selected", "false");
  });

  it("renders tabs with correct routing links", () => {
    renderNav();
    
    expect(screen.getByRole("tab", { name: /메인/i })).toHaveAttribute("href", "/main");
    expect(screen.getByRole("tab", { name: /인증/i })).toHaveAttribute("href", "/certificate");
    expect(screen.getByRole("tab", { name: /벌칙/i })).toHaveAttribute("href", "/penalty");
    expect(screen.getByRole("tab", { name: /모임관리/i })).toHaveAttribute("href", "/management");
  });

  it("applies correct styles to tabs", () => {
    renderNav();
    
    const tab = screen.getByRole("tab", { name: /메인/i });
    expect(tab).toHaveStyle({
      padding: "0",
      minHeight: "40px",
      height: "40px"
    });
  });

  it("sets correct initial tab for different routes", () => {
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

  it("maintains tab selection when navigating", () => {
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