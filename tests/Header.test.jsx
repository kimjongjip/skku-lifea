import { render, screen } from "@testing-library/react";
import Header from "../src/components/common/Header";
import { expect, describe, it } from "vitest";
import "@testing-library/jest-dom";

describe("Header", () => {
  it("renders logo image", () => {
    render(<Header />);
    
    const logoImage = screen.getByAltText("logo");
    expect(logoImage).toBeInTheDocument();
    expect(logoImage).toHaveAttribute("src", "src/assets/logo.png");
  });

  it("renders skku life text", () => {
    render(<Header />);
    expect(screen.getByText("스꾸라이프")).toBeInTheDocument();
  });

  it("has correct container styles", () => {
    render(<Header />);
    const headerContainer = screen.getByAltText("logo").closest('div');
    
    expect(headerContainer).toHaveStyle({
      width: "100%",
      display: "flex",
      flexDirection: "row",
      height: "60px",
      position: "sticky",
      top: "0"
    });
  });

  it("logo has correct styles", () => {
    render(<Header />);
    const logoImage = screen.getByAltText("logo");
    expect(logoImage).toHaveStyle({
      width: "30%",
      height: "60px",
      padding: "5px",
      objectFit: "contain"
    });
  });

  it("text container has correct styles", () => {
    const { container } = render(<Header />);
    
    // 헤더의 두 번째 자식 div(텍스트 컨테이너)를 선택
    const headerContainer = screen.getByAltText("logo").closest('div');
    const textDiv = headerContainer.children[1];  // 두 번째 자식 선택 (첫 번째는 이미지)
    
    expect(textDiv).toHaveStyle({
      width: "70%",
      textAlign: "left"
    });
  });
});