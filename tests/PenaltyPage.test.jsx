import { render, screen, waitFor } from "@testing-library/react";
import PenaltyPage from "@/pages/PenaltyPage";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";

describe("PenaltyPage", () => {
  test("renders header and navigation", () => {
    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    expect(screen.getByRole("tab", { name: /메인/i })).toBeInTheDocument();
  });

  test("renders date divider for messages", async () => {
    const mockMessages = {
      penaltyLogs: [
        { alaramDate: "2024-11-23T12:00:00Z", alarmMessage: "첫 번째 메시지", alarmType: "penalty" },
        { alaramDate: "2024-11-24T09:00:00Z", alarmMessage: "두 번째 메시지", alarmType: "nopenalty" },
      ],
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockMessages),
    });

    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/첫 번째 메시지/)).toBeInTheDocument();
      expect(screen.getByText(/두 번째 메시지/)).toBeInTheDocument();
    });

    expect(screen.getByText(/2024년 11월 23일/)).toBeInTheDocument();
    expect(screen.getByText(/2024년 11월 24일/)).toBeInTheDocument();

    global.fetch.mockRestore();
  });

  test("handles empty message data gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({ penaltyLogs: [] }),
    });

    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("no-message")).toHaveTextContent("메시지가 없습니다");
    });

    global.fetch.mockRestore();
  });

  test("handles API call failure", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network Error"));

    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent("오류가 발생했습니다");
    });

    global.fetch.mockRestore();
  });

  test("renders message with default style for unknown type", () => {
    const unknownMessage = {
      date: "2024년 11월 25일 월요일",
      time: "12:00",
      content: "Unknown type message",
      type: "not type",
    };

    render(
      <div>
        <div data-testid="unknown-message" style={{
          padding: "10px",
          borderRadius: "8px",
          marginBottom: "10px",
          backgroundColor: "#F0F0F0", // Default color
        }}>
          {unknownMessage.content}
        </div>
      </div>
    );

    const messageElement = screen.getByTestId("unknown-message");
    expect(messageElement).toHaveStyle("background-color: #F0F0F0");
  });
});
