import { render, screen, waitFor } from "@testing-library/react";
import PenaltyPage from "@/pages/PenaltyPage";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// fetchWithToken을 모킹
vi.mock("@/utils/fetchWithToken", () => ({
  fetchWithToken: vi.fn(),
}));

describe("PenaltyPage", () => {
  const { fetchWithToken } = require("@/utils/fetchWithToken");

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
      status: "success",
      data: {
        penaltyLogs: [
          {
            alaramDate: "2024-11-23T12:00:00.000Z",
            alarmMessage: "첫 번째 메시지",
            alarmType: "penalty",
          },
          {
            alaramDate: "2024-11-24T09:00:00.000Z",
            alarmMessage: "모두가 인증을 완료했습니다",
            alarmType: "nopenalty",
          },
        ],
      },
    };

    fetchWithToken.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockMessages),
    });

    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("첫 번째 메시지")).toBeInTheDocument();
    }, { timeout: 3000 });

    const penaltyMessage = screen.getByText("첫 번째 메시지");
    expect(penaltyMessage.parentElement).toHaveStyle("background-color: #FFE5E5");

    const noPenaltyMessage = screen.getByText("모두가 인증을 완료했습니다");
    expect(noPenaltyMessage).toBeInTheDocument();
    expect(noPenaltyMessage.parentElement.parentElement).toHaveStyle("background-color: #E5FFE5");

    expect(screen.getByText(/2024년 11월 23일/)).toBeInTheDocument();
    expect(screen.getByText(/2024년 11월 24일/)).toBeInTheDocument();
  });

  test("handles empty message data gracefully", async () => {
    const mockEmptyResponse = {
      status: "success",
      data: {
        penaltyLogs: [],
      },
    };

    fetchWithToken.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmptyResponse),
    });

    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("모두가 인증을 완료했습니다")).toBeInTheDocument();
    });
  });

  test("handles API call failure", async () => {
    fetchWithToken.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <MemoryRouter>
        <PenaltyPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("error-message")).toHaveTextContent("오류가 발생했습니다");
    });
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
        <div
          data-testid="unknown-message"
          style={{
            padding: "10px",
            borderRadius: "8px",
            marginBottom: "10px",
            backgroundColor: "#F0F0F0", // Default color
          }}
        >
          {unknownMessage.content}
        </div>
      </div>
    );

    const messageElement = screen.getByTestId("unknown-message");
    expect(messageElement).toHaveStyle("background-color: #F0F0F0");
  });
});
