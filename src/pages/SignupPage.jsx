import React, { useState } from "react";
import { TextField, Button } from "@mui/material";
import Header from "../components/common/Header";
import Nav from "../components/common/Nav";
import Chart from "../components/main/Chart";

export default function SignupPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <Header />
      <Nav />
      <Chart />
    </div>
  );
}
