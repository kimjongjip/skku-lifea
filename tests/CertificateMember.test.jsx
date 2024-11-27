import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import { useNavigate } from "react-router-dom";
import CertificateMember from "@/components/certificate/CertificateMember";
import "@testing-library/jest-dom";

// React Router의 useNavigate mock
vi.mock('react-router-dom', () => ({
 useNavigate: vi.fn()
}));

describe("CertificateMember", () => {
 const mockNavigate = vi.fn();
 
 const defaultProps = {
   img: "src/assets/logo.png",
   userName: "Test User",
   totalCnt: 10,
   curCnt: 5,
   status: "none",
   id: "test-id",
   date: "2024-01-01"
 };

 beforeEach(() => {
   vi.clearAllMocks();
   useNavigate.mockReturnValue(mockNavigate);
 });

 test("renders member information correctly", () => {
   render(<CertificateMember {...defaultProps} />);
   
   expect(screen.getByText("Test User")).toBeInTheDocument();
   expect(screen.getByText("투표 현황 5/10")).toBeInTheDocument();
   expect(screen.getByAltText("user")).toBeInTheDocument();
 });

 test("navigates to detail page on click", () => {
   render(<CertificateMember {...defaultProps} />);
   
   fireEvent.click(screen.getByText("Test User").parentElement.parentElement);
   
   expect(mockNavigate).toHaveBeenCalledWith("test-id", {
     state: {
       name: "Test User",
       status: "none",
       id: "test-id",
       statusColor: "#BBD6FF",
       date: "2024-01-01",
       img: "src/assets/logo.png"
     }
   });
 });

 test("handles vote button clicks", () => {
   render(<CertificateMember {...defaultProps} />);
   
   const approveButton = screen.getByText("v");
   const rejectButton = screen.getByText("x");
   
   fireEvent.click(approveButton);
   expect(screen.getByText("투표 현황 6/10")).toBeInTheDocument();
   
   fireEvent.click(rejectButton);
   expect(screen.getByText("투표 현황 7/10")).toBeInTheDocument();
 });

 test("displays correct status message for fail status", () => {
   render(
     <CertificateMember
       {...defaultProps}
       status="fail"
     />
   );
   
   expect(screen.getByText("인증 실패")).toBeInTheDocument();
   expect(screen.queryByText("v")).not.toBeInTheDocument();
   expect(screen.queryByText("x")).not.toBeInTheDocument();
 });

 test("displays correct status message for success status", () => {
   render(
     <CertificateMember
       {...defaultProps}
       status="success"
     />
   );
   
   expect(screen.getByText("인증 성공")).toBeInTheDocument();
   expect(screen.queryByText("v")).not.toBeInTheDocument();
   expect(screen.queryByText("x")).not.toBeInTheDocument();
 });

 test("updates vote count correctly", () => {
   render(<CertificateMember {...defaultProps} />);
   
   const approveButton = screen.getByText("v");
   fireEvent.click(approveButton);
   
   expect(screen.getByText("투표 현황 6/10")).toBeInTheDocument();
 });

 test("prevents event propagation on vote buttons", () => {
   render(<CertificateMember {...defaultProps} />);
   
   const approveButton = screen.getByText("v");
   const rejectButton = screen.getByText("x");
   
   fireEvent.click(approveButton);
   fireEvent.click(rejectButton);
   
   // 내비게이션이 호출되지 않았는지 확인
   expect(mockNavigate).not.toHaveBeenCalled();
 });
});