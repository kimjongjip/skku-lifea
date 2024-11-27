import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CertificateBtn from "@/components/certificate/CertificateBtn";
import axios from "axios";
import { vi } from 'vitest';
import "@testing-library/jest-dom";

vi.mock("axios");

// classId를 전역으로 정의
global.classId = "test-class-id";

describe("CertificateBtn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders initial upload button", () => {
    render(<CertificateBtn />);
    const uploadButton = screen.getByText("+ 인증하기");
    expect(uploadButton).toBeInTheDocument();
  });

  test("handles file upload", async () => {
    render(<CertificateBtn />);
    const file = new File(["test image"], "test.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const reuploadButton = await screen.findByText("다시 업로드 하기");
    expect(reuploadButton).toBeInTheDocument();
  });

  test("handles file upload API call", async () => {
    // Setup
    axios.post.mockResolvedValueOnce({ data: "success" });
    render(<CertificateBtn />);
    
    // Act
    const file = new File(["test image"], "test.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Assert
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  test("handles API error", async () => {
    axios.post.mockRejectedValueOnce(new Error("Upload failed"));
    render(<CertificateBtn />);
    
    const file = new File(["test image"], "test.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("이미지 업로드 중 문제가 발생했습니다.");
    });
  });

  test("handles delete/reupload", async () => {
    render(<CertificateBtn />);
    
    const file = new File(["test image"], "test.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [file] } });

    const reuploadButton = await screen.findByText("다시 업로드 하기");
    fireEvent.click(reuploadButton);

    expect(screen.getByText("+ 인증하기")).toBeInTheDocument();
  });

  test("handles empty file selection", () => {
    render(<CertificateBtn />);
    
    const fileInput = document.querySelector('input[type="file"]');
    fireEvent.change(fileInput, { target: { files: [] } });

    expect(screen.getByText("+ 인증하기")).toBeInTheDocument();
  });
});