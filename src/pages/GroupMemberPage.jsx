import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import MainMemberCertificate from "../components/main/MainMemberCertificate";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function GroupMemberPage() {
  const location = useLocation();
  const user = location.state.users;

  const today = new Date();

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const [verificationData, setVerificationData] = useState([]);

  const getUserVerification = async () => {
    const requests = [];
    const dateLabels = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const formattedDate = formatDate(targetDate);
      const request = axios.get(
        `https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/verification/${user.userClass[0].classId}/${formattedDate}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k",
          },
        }
      );
      requests.push(request);
      dateLabels.push(formattedDate);
    }

    try {
      const responses = await Promise.all(requests);
      const validData = responses
        .map((res, index) => ({
          date: dateLabels[index],
          data: res.data,
        }))
        .filter(
          (entry) =>
            entry.data.verifications && entry.data.verifications.length > 0
        );

      setVerificationData(validData);
    } catch (error) {
      console.error("인증 기록 불러오기 에러:", error);
    }
  };

  useEffect(() => {
    getUserVerification();
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginTop: "120px",
      }}
    >
      <Header />
      <Nav />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: "10px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            width: "90%",
            alignItems: "center",
          }}
        >
          <img
            src={user.userImage}
            alt="user"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50px",
              backgroundColor: "#D9D9D9",
              margin: 0,
            }}
          ></img>
          <div style={{ margin: 0, fontWeight: "bold" }}>{user.userName}</div>
        </div>

        <div style={{ width: "90%" }}>인증 현황</div>

        {verificationData.map((d) => {
          return (
            <MainMemberCertificate
              key={d.date}
              date={d.date}
              image={d.data.verifications[0].verificationImage}
              status="success"
            />
          );
        })}
      </div>
    </div>
  );
}