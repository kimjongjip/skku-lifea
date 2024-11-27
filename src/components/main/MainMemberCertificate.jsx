/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainMemberCertificate({ image, date, status }) {
  const [statusColor, setStatusColor] = useState("#BBD6FF");
  useEffect(() => {
    status === "none"
      ? setStatusColor("#BBD6FF")
      : status === "fail"
      ? setStatusColor("#FFAFB0")
      : setStatusColor("#C8FFC3");
  }, [status]);

  return (
    <div
      style={{
        backgroundColor: `${statusColor}`,
        width: "90%",
        height: "13vh",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "row",
      }}
    >
      {" "}
      <div>
        <div style={{ fontWeight: "bold" }}>{date}</div>
      </div>
      {status === "success" ? (
        <div style={{ width: "20%", textAlign: "center" }}>인증 성공</div>
      ) : (
        <div style={{ width: "20%", textAlign: "center" }}>인증 실패</div>
      )}
      <img
        src={image}
        alt="user"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "5px",
          backgroundColor: "#D9D9D9",
        }}
      ></img>
    </div>
  );
}
