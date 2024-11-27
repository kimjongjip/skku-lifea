import React, { useEffect, useState } from "react";
import Header from "../components/common/Header";
import CertificateBtn from "../components/certificate/CertificateBtn.jsx";
import CertificateMember from "../components/certificate/CertificateMember";
import Nav from "../components/common/Nav";
import axios from "axios";

export default function CertificationPage() {
  const [certification, setCertification] = useState([]);
  const [classInfo, setClassInfo] = useState("");
  const today = new Date();
  const formatDate = (date) => date.toISOString().split("T")[0];

  const getDateRange = (days) => {
    const dates = [];
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dates.push(formatDate(date));
    }
    return dates;
  };

  const getUserInfo = async () => {
    try {
      const res = await axios.get(
        "https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/user/info",
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k",
          },
        }
      );
      setClassInfo(res.data.userClass[0]);
      console.log("11", res.data.userClass[0]);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const getCertification = async () => {
    const dates = getDateRange(5);
    const requests = dates.map((date) =>
      axios.get(
        `https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/verification/${classInfo.classId}/${date}`,
        {
          headers: {
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k",
          },
        }
      )
    );

    try {
      const responses = await Promise.all(requests);
      const data = responses.map((res, index) => ({
        date: dates[index],
        verifications: res.data.verifications || [],
      }));
      setCertification(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching certification data:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (classInfo) {
      getCertification();
    }
  }, [classInfo]);

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
        }}
      >
        <CertificateBtn />
        {certification.map(({ date, verifications }) => (
          <div key={date} style={{ width: "90%" }}>
            <div style={{ fontWeight: "bold", marginBottom: "10px" }}>
              {date}
            </div>
            {verifications.length > 0 ? (
              verifications.map((data, index) => (
                <CertificateMember
                  key={index}
                  id={data.verificationId}
                  date={date}
                  userName={data.userName}
                  totalCnt={classInfo.classMember.length}
                  curCnt={data.yesVote + data.noVote}
                  status={data.noVote > data.yesVote ? "fail" : "success"}
                  img={data.verificationImage}
                />
              ))
            ) : (
              <div
                style={{
                  borderTop: "1px solid #ccc",
                  marginTop: "10px",
                  paddingTop: "10px",
                }}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
