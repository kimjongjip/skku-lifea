import React, { useState } from "react";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";

export default function PenaltyPage() {
  // 초기 예시 데이터
  const initialMessages = [
    {
      date: "2024년 3월 21일 목요일",
      time: "12:00",
      content: "모두가 목표를 달성했어요! 오늘도 수고하셨습니다 👏",
      type: "nopenalty",
      timestamp: new Date("2024-03-21 12:00").getTime()
    },
    {
      date: "2024년 3월 20일 수요일",
      time: "23:50",
      content: "김성실(2022123456)님의 벌칙이 이열심(2023111111)님에게 전달되었습니다.",
      type: "penalty",
      timestamp: new Date("2024-03-20 23:50").getTime()
    },
    {
      date: "2024년 3월 20일 수요일",
      time: "23:45",
      content: "박공부(2023222222)님의 벌칙이 최노력(2024333333)님에게 전달되었습니다.",
      type: "penalty",
      timestamp: new Date("2024-03-20 23:45").getTime()
    },
    {
      date: "2024년 3월 19일 화요일",
      time: "12:00",
      content: "모두가 목표를 달성했어요! 오늘도 수고하셨습니다 👏",
      type: "nopenalty",
      timestamp: new Date("2024-03-19 12:00").getTime()
    }
  ];

  const [messages, setMessages] = useState(initialMessages);

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = days[date.getDay()];
    
    return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`;
  };

  // 테스트용 메시지 추가 함수
  const addTestMessage = (type) => {
    const now = new Date();
    const newMessage = {
      date: formatDate(now),
      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      content: type === 'penalty' 
        ? "홍길동(2024444444)님의 벌칙이 김철수(2023555555)님에게 전달되었습니다."
        : "모두가 목표를 달성했어요! 오늘도 수고하셨습니다 👏",
      type: type,
      timestamp: now.getTime()
    };
    setMessages([newMessage, ...messages]);
  };

  // 메시지 스타일 함수 수정
  const getMessageStyle = (type) => {
    const baseStyle = {
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "10px",
    };

    switch (type) {
      case 'penalty':
        return {
          ...baseStyle,
          backgroundColor: "#FFE5E5", // 벌칙은 연한 빨간색
        };
      case 'nopenalty':
        return {
          ...baseStyle,
          backgroundColor: "#E5FFE5", // 목표 달성은 연한 초록색
          textAlign: "center",
          fontWeight: "bold",
          padding: "20px", // 패딩 증가
          margin: "15px 0", // 상하 여백 증가
          fontSize: "18px",
        };
      case 'certification':
        return {
          ...baseStyle,
          backgroundColor: "#E5F6FF", // 인증 관련은 연한 파란색
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: "#F0F0F0", // 기본 회색
        };
    }
  };

  // 메시지 내용을 렌더링하는 컴포넌트
  const MessageContent = ({ message }) => {
    if (message.type === 'nopenalty') {
      return (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🎉</span>
          {message.content}
          <span style={{ fontSize: '16px' }}>🎉</span>
        </div>
      );
    }
    return <div>{message.content}</div>;
  };

  // 날짜 구분선 컴포넌트
  const DateDivider = ({ date }) => (
    <div style={{
      textAlign: 'center',
      margin: '20px 0',
      position: 'relative',
    }}>
      <div style={{
        backgroundColor: '#E8E8E8',
        padding: '5px 15px',
        borderRadius: '15px',
        display: 'inline-block',
        fontSize: '13px',
        color: '#666',
      }}>
        {date}
      </div>
    </div>
  );

  return (
    <div style={{
      width: "100%",
      margin: "0",
      padding: "0",
      boxSizing: "border-box",
      fontFamily: "Arial, sans-serif",
      color: "#333",
    }}>
      <Header />
      <Nav />

      {/* 테스트용 버튼 */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        padding: "10px",
        backgroundColor: "#f5f5f5",
      }}>
        <button 
          onClick={() => addTestMessage('penalty')}
          style={{
            padding: "5px 10px",
            backgroundColor: "#FFE5E5",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          벌칙 메시지 추가
        </button>
        <button 
          onClick={() => addTestMessage('nopenalty')}
          style={{
            padding: "5px 10px",
            backgroundColor: "#E5FFE5",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          목표달성 메시지 추가
        </button>
      </div>

      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "20px",
        boxSizing: "border-box",
      }}>
        <div style={{
          width: "100%",
          maxWidth: "600px",
          padding: "0 20px",
          boxSizing: "border-box",
        }}>
          {messages.reduce((acc, message, index) => {
            // 첫 메시지이거나 이전 메시지와 날짜가 다른 경우 날짜 구분선 추가
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
                <div style={{ 
                  fontSize: "12px", 
                  color: "#888", 
                  marginBottom: "10px",
                  textAlign: message.type === 'nopenalty' ? 'center' : 'left'
                }}>
                  {message.time}
                </div>
              </div>
            );
            
            return acc;
          }, [])}
        </div>
      </div>
    </div>
  );
}