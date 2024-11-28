import { render, screen } from "@testing-library/react";
import MainMemberCertificate from "@/components/main/MainMemberCertificate";
import "@testing-library/jest-dom";

describe("MainMemberCertificate", () => {
  const defaultProps = {
    image: "test-image.jpg",
    date: "2024-11-27",
    status: "success"
  };

  test("renders date correctly", () => {
    render(<MainMemberCertificate {...defaultProps} />);
    expect(screen.getByText("2024-11-27")).toBeInTheDocument();
  });

  test("displays success message when status is success", () => {
    render(<MainMemberCertificate {...defaultProps} />);
    expect(screen.getByText("인증 성공")).toBeInTheDocument();
  });

  test("displays fail message when status is fail", () => {
    render(<MainMemberCertificate {...defaultProps} status="fail" />);
    expect(screen.getByText("인증 실패")).toBeInTheDocument();
  });

  test("renders certification image", () => {
    render(<MainMemberCertificate {...defaultProps} />);
    const image = screen.getByAltText("user");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "test-image.jpg");
  });

  test('sets status color based on status prop', () => {
    const { rerender } = render(<MainMemberCertificate {...defaultProps} status="none" />);
    const container = screen.getByText(defaultProps.date).closest('div[style*="background-color"]');
    expect(container).toHaveStyle({ backgroundColor: '#BBD6FF' });

    rerender(<MainMemberCertificate {...defaultProps} status="fail" />);
    expect(container).toHaveStyle({ backgroundColor: '#FFAFB0' });

    rerender(<MainMemberCertificate {...defaultProps} status="success" />);
    expect(container).toHaveStyle({ backgroundColor: '#C8FFC3' });
  });
});