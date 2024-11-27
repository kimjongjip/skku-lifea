/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";

export default function CertificateMember({
  img,
  userName,
  totalCnt,
  curCnt,
  status,
  id,
  date,
}) {
  const [statusColor, setStatusColor] = useState("#BBD6FF");
  const [cnt, setCnt] = useState(curCnt);
  const navigate = useNavigate();

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
        width: "100%",
        height: "120px",
        borderRadius: "20px",
        display: "flex",
        flexDirection: "row",
      }}
      onClick={() => {
        navigate(`${id}`, {
          state: {
            name: userName,
            status: status,
            id: id,
            statusColor: statusColor,
            date: date,
            img: img,
          },
        });
      }}
    >
      <Avatar
        src="src/assets/logo.png"
        alt="user"
        style={{
          width: "80px",
          height: "80px",
          backgroundColor: "#D9D9D9",
        }}
      ></Avatar>
      <div>
        <div style={{ fontWeight: "bold" }}>{userName}</div>
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
