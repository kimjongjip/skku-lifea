import React, { Component } from "react";
import Header from "../components/common/Header";
import CertificateBtn from "../components/certificate/CertificateBtn.jsx";
import CertificateMember from "../components/certificate/CertificateMember";
import { useState } from "react";
import Nav from "../components/common/Nav";

const dummy = [
  { id: 1, userName: "테스트1", curCnt: 0, totalCnt: 6, status: "none" },
  { id: 2, userName: "테스트2", curCnt: 1, totalCnt: 3, status: "fail" },
  { id: 3, userName: "테스트3", curCnt: 1, totalCnt: 3, status: "success" },
  { id: 4, userName: "테스트4", curCnt: 1, totalCnt: 3, status: "fail" },
  { id: 5, userName: "테스트5", curCnt: 1, totalCnt: 3, status: "success" },
  { id: 6, userName: "테스트6", curCnt: 1, totalCnt: 3, status: "success" },
];
export default function CertificationPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
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
        <div style={{ marginRight: "75%", fontWeight: "bold" }}>2024.8.20</div>
        <CertificateBtn />
        {dummy.map((data) => (
          <CertificateMember
            key={data.id}
            id={data.id}
            userName={data.userName}
            totalCnt={data.totalCnt}
            curCnt={data.curCnt}
            status={data.status}
          />
        ))}
      </div>
    </div>
  );
}
