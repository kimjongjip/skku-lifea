import React from "react";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import MainMemberCertificate from "../components/main/MainMemberCertificate";

export default function GroupMemberPage() {
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
          }}
        >
          <img
            src="src/assets/logo.png"
            alt="user"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50px",
              backgroundColor: "#D9D9D9",
              margin: 0,
            }}
          ></img>
          <div style={{ margin: 0 }}>멤버 이름</div>
        </div>
        <div style={{ width: "90%" }}>통계치</div>
        <div
          style={{
            width: "90%",
            height: "30vh",
            backgroundColor: "#D9D9D9",
          }}
        >
          통계치 부분
        </div>
        <div style={{ width: "90%" }}>인증 현황</div>
        <MainMemberCertificate />
      </div>
    </div>
  );
}
