import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import { useLocation } from "react-router-dom";
import { fetchWithToken } from "@/utils/fetchWithToken"; // 유틸리티 함수 가져오기

export default function PenaltyPage() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);

  // location을 사용하여 라우트 변경 감지
  const location = useLocation();

  const fetchMessages = async () => {
    try {
      const response = await fetchWithToken(
        "https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/penalty/1/log"
      );
      const data = await response.json();

      // 로그가 비어있을 경우 오늘 날짜로 'nopenalty' 메시지 생성
      if (!data.penaltyLogs || data.penaltyLogs.length === 0) {
        const today = new Date();
        setMessages([
          {
            date: formatDate(today),
            time: "00:00",
            content: "모두가 인증을 완료했습니다",
            type: "nopenalty",
            timestamp: today.getTime(),
          },
        ]);
        setError(false);
        return;
      }

      // API 응답을 날짜별로 그룹화
      const messagesByDate = {};
      data.penaltyLogs.forEach((log) => {
        const date = new Date(log.alaramDate);
        const dateStr = formatDate(date);

        if (!messagesByDate[dateStr]) {
          messagesByDate[dateStr] = [];
        }

        messagesByDate[dateStr].push({
          date: dateStr,
          time: `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`,
          content: log.alarmMessage,
          type: log.alarmType,
          timestamp: date.getTime(),
        });
      });

      // 각 날짜에 대해 벌칙이 없으면 'nopenalty' 메시지 추가
      const formattedMessages = [];
      Object.entries(messagesByDate).forEach(([date, messages]) => {
        if (messages.every((msg) => msg.type !== "penalty")) {
          formattedMessages.push({
            date,
            time: "00:00",
            content: "모두가 인증을 완료했습니다",
            type: "nopenalty",
            timestamp: new Date(date).getTime(),
          });
        }
        formattedMessages.push(...messages);
      });

      // 타임스탬프로 정렬
      formattedMessages.sort((a, b) => b.timestamp - a.timestamp);

      setMessages(formattedMessages);
      setError(false);
    } catch (error) {
      console.error("메시지 가져오기 실패:", error);
      setError(true);
    }
  };

  // useEffect의 의존성 배열에 location 추가
  useEffect(() => {
    fetchMessages();
  }, [location]);

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    const days = ["일", "월", "화", "수", "목", "금", "토"];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
  };

  // 메시지 스타일 함수
  const getMessageStyle = (type) => {
    const baseStyle = {
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "10px",
    };

    switch (type) {
      case "penalty":
        return {
          ...baseStyle,
          backgroundColor: "#FFE5E5",
        };
      case "nopenalty":
        return {
          ...baseStyle,
          backgroundColor: "#E5FFE5",
          textAlign: "center",
          fontWeight: "bold",
          padding: "20px",
          margin: "15px 0",
          fontSize: "18px",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: "#F0F0F0",
        };
    }
  };

  // 메시지 내용 렌더링
  const MessageContent = ({ message }) => {
    if (message.type === "nopenalty") {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>🎉</span>
          {message.content}
          <span style={{ fontSize: "16px" }}>🎉</span>
        </div>
      );
    }
    return <div>{message.content}</div>;
  };

  // 날짜 구분선
  const DateDivider = ({ date }) => (
    <div
      style={{
        textAlign: "center",
        margin: "20px 0",
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "#E8E8E8",
          padding: "5px 15px",
          borderRadius: "15px",
          display: "inline-block",
          fontSize: "13px",
          color: "#666",
        }}
      >
        {date}
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "100%",
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <Header />
      <Nav />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "600px",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          {error ? (
            <div
              data-testid="error-message"
              style={{
                textAlign: "center",
                color: "red",
                fontWeight: "bold",
              }}
            >
              오류가 발생했습니다
            </div>
          ) : messages.length === 0 ? (
            <div
              data-testid="no-message"
              style={{
                textAlign: "center",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              메시지가 없습니다
            </div>
          ) : (
            messages.reduce((acc, message, index) => {
              if (index === 0 || messages[index - 1].date !== message.date) {
                acc.push(
                  <DateDivider
                    key={`date-${message.date}`}
                    date={message.date}
                  />
                );
              }
              acc.push(
                <div key={`message-${index}`}>
                  <div style={getMessageStyle(message.type)}>
                    <MessageContent message={message} />
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "10px",
                      textAlign:
                        message.type === "nopenalty" ? "center" : "left",
                    }}
                  >
                    {message.time}
                  </div>
                </div>
              );
              return acc;
            }, [])
          )}
        </div>
      </div>
    </div>
  );
}
