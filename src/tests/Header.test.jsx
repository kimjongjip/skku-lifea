// tests/Header.test.jsx

import { render, screen } from "@testing-library/react";
import Header from "@/components/common/Header"; // 실제 경로로 수정하세요
import "@testing-library/jest-dom";
import { vi } from "vitest";

// 이미지 모킹
vi.mock("/src/assets/logo.png", () => ({ default: "logo.png" }));

describe("Header", () => {
  it("컴포넌트를 정상적으로 렌더링한다", () => {
    render(<Header />);
    expect(screen.getByAltText("logo")).toBeInTheDocument();
    expect(screen.getByText("스꾸라이프")).toBeInTheDocument();
  });

  it("로고 이미지를 올바른 src와 alt 속성으로 렌더링한다", () => {
    render(<Header />);
    const logoImage = screen.getByAltText("logo");
    expect(logoImage).toHaveAttribute("src", "logo.png");
  });
});
