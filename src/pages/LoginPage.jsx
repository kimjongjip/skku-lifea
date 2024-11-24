import { useState } from "react";
import { TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "80%",
        gap: "20px",
      }}
    >
      <img
        src="src/assets/logo.png"
        alt="logo"
        style={{ objectFit: "contain", paddingBottom: "60px" }}
      />
      <div>
        <TextField
          id="outlined-basic"
          label="이메일"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          label="비밀번호"
          variant="outlined"
          fullWidth
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        />
      </div>
      <Button
        onClick={() => navigate("/main")}
        variant="contained"
        style={{ padding: "10px", backgroundColor: "#F2F2F2", color: "black" }}
      >
        로그인
      </Button>
      <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
        <div onClick={(e) => console.log(e)}>비밀번호 찾기</div>
        <div onClick={(e) => console.log(e)}>회원가입 </div>
      </div>
    </div>
  );
}
