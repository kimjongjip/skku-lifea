import React, { useState, useEffect } from "react";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";

export default function PenaltyPage() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(false);

  // 메시지 가져오기
  const fetchMessages = async () => {
    try {
      const response = await fetch(
        "https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/penalty/1/log"
      );
      const data = await response.json();

      // API 응답 형식을 기존 메시지 형식으로 변환
      const formattedMessages = data.penaltyLogs.map((log) => {
        const date = new Date(log.alaramDate);
        return {
          date: formatDate(date),
          time: `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
          ).padStart(2, "0")}`,
          content: log.alarmMessage,
          type: log.alarmType,
          timestamp: date.getTime(),
        };
      });

      setMessages(formattedMessages);
      setError(false); // 성공적으로 데이터를 가져왔으므로 에러 상태 초기화
    } catch (error) {
      console.error("메시지 가져오기 실패:", error);
      setError(true); // 에러 발생 시 상태 업데이트
    }
  };

  // 컴포넌트 마운트 시 메시지 가져오기
  useEffect(() => {
    fetchMessages();
  }, []);

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
          gap: "10px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: "#FFE5E5",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          벌칙 메시지 추가
        </button>
        <button
          style={{
            padding: "5px 10px",
            backgroundColor: "#E5FFE5",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          목표달성 메시지 추가
        </button>
      </div>

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
                  <DateDivider key={`date-${message.date}`} date={message.date} />
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
