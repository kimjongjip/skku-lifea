import React from "react";
import profileImg from "/src/assets/logo.png";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PersonalCertificationPage() {
  const location = useLocation();
  const { name, id, status, statusColor, date } = location.state;

  const [certification, setCertification] = useState([]);
  const [processedData, setProcessedData] = useState([]);
  useEffect(() => {
    getCertification();
  }, []);
  const getCertification = async () => {
    const res = await axios.get(
      `https://nsptbxlxoj.execute-api.ap-northeast-2.amazonaws.com/dev/verification/${1}`
    );
    const data = res.data.verifications;

    setCertification([...data]);
  };

  useEffect(() => {
    const data = certification.filter((item) => {
      return (
        item.userName === name && item.certificationDate.slice(0, 10) === date
      );
    });
    setProcessedData(data);
  }, [certification]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        marginTop: "120px",
        alignItems: "center",
      }}
    >
      <Header />
      <Nav />
      <div
        style={{
          display: "flex",
          width: "90%",
          gap: "10px",
          margin: "0px",
        }}
      >
        <img
          src={profileImg}
          alt="user"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50px",
            backgroundColor: "#D9D9D9",
            margin: 0,
          }}
        />
        <div style={{ margin: 0 }}>
          <div style={{ fontWeight: "bold" }}>{name}</div>
          <div>{date}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          height: "60vh",
          width: "90%",
          backgroundColor: `${statusColor}`,
          borderRadius: "20px",
          display: "flex",
        }}
      >
        <img
          src={processedData[0]?.certificationImage}
          alt="이미지"
          style={{ width: "100%" }}
        ></img>
      </div>
    </div>
  );
}
