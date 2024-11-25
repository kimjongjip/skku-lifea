/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainMemberCertificate({
  userName,
  totalCnt,
  curCnt,
  status,
  id,
}) {
  const [statusColor, setStatusColor] = useState("#BBD6FF");
  const [cnt, setCnt] = useState(curCnt);

  useEffect(() => {
    status === "none"
      ? setStatusColor("#BBD6FF")
      : status === "fail"
      ? setStatusColor("#FFAFB0")
      : setStatusColor("#C8FFC3");
  }, [status]);
  const handleVote = (v) => {
    setCnt(cnt + 1);
    if (cnt > totalCnt) {
      // 실패/성공 결과 띄우기
    }
    if (v.innerText === "v") {
      //찬성 투표 post 요청
    } else {
      //반대 투표 post 요청
    }
  };
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
      <img
        src="src/assets/logo.png"
        alt="user"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50px",
          backgroundColor: "#D9D9D9",
        }}
      ></img>
      <div>
        <div style={{ fontWeight: "bold" }}>{"2024.11.10"}</div>
        <div>
          투표 현황 {cnt}/{totalCnt}
        </div>
      </div>
      {status === "none" ? (
        <div style={{ width: "20%", gap: "10px", display: "flex" }}>
          {" "}
          <button
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "lightgreen",
              textAlign: "center",
              padding: "0px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("vote click");
              handleVote(e.target);
            }}
          >
            v
          </button>
          <button
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: "pink",
              textAlign: "center",
              padding: "0px",
            }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("vote click");
              handleVote(e.target);
            }}
          >
            x
          </button>
        </div>
      ) : status === "fail" ? (
        <div style={{ width: "20%", textAlign: "center" }}>인증 실패</div>
      ) : (
        <div style={{ width: "20%", textAlign: "center" }}>인증 성공</div>
      )}
    </div>
  );
}
