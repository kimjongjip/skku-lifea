import React, { Component } from "react";
import Header from "../components/common/Header";
import CertificateBtn from "../components/certificate/CertificateBtn.jsx";
import CertificateMember from "../components/certificate/CertificateMember";
import { useState, useEffect } from "react";
import Nav from "../components/common/Nav";
import axios from "axios";

const dummy = [
  { id: 1, userName: "테스트1", curCnt: 0, totalCnt: 6, status: "none" },
  { id: 2, userName: "테스트2", curCnt: 1, totalCnt: 3, status: "fail" },
  { id: 3, userName: "테스트3", curCnt: 1, totalCnt: 3, status: "success" },
  { id: 4, userName: "테스트4", curCnt: 1, totalCnt: 3, status: "fail" },
  { id: 5, userName: "테스트5", curCnt: 1, totalCnt: 3, status: "success" },
  { id: 6, userName: "테스트6", curCnt: 1, totalCnt: 3, status: "success" },
];
export default function CertificationPage() {
  const [certification, setCertification] = useState([]);
  useEffect(() => {
    getCertification();
  }, []);
  const classId = "1";
  const date = "20240101";
  const getCertification = async () => {
    const res = await axios.get(
      `https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/verification/${classId}/${date}`,
      {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjaGxla2RsZjEyMzRAZ21haWwuY29tIiwiaWF0IjoxNzMyNjA1OTU5LCJleHAiOjE3NjQxNDE5NTl9.86LBbz7DGZGGlLrJVwNwZmroV6XB_m-BqkPtcbm_z8k",
        },
      }
    );
    const data = res.data.verifications;
    setCertification([...data]);
  };

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
        <div style={{ fontWeight: "bold", width: "90%" }}>
          {/* {certification[0]?.certificationDate.slice(0, 10)} */}
        </div>
        <CertificateBtn />
        {dummy.map((data) => (
          <CertificateMember
            key={data.id}
            id={data.id}
            date={data.certificationDate}
            userName={data.userName}
            totalCnt={data.totalCnt}
            curCnt={data.noNumber + data.yesNumber}
            status={data.noNumber > data.yesNumber ? "success" : "fail"}
          />
        ))}
      </div>
    </div>
  );
}
