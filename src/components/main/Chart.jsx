/* eslint-disable react/prop-types */
import React from "react";
import ReactApexChart from "react-apexcharts";

export default function Chart({ data }) {
  if (data.length >= 5) {
    data = data.slice(0, 5);
  }
  const categories = data.map((item) => item.date);
  const notVerifiedData = data.map((item) =>
    ((item.notVerified / item.total) * 100).toFixed(2)
  );
  const successData = data.map((item) =>
    ((item.success / item.total) * 100).toFixed(2)
  );
  const failData = data.map((item) =>
    ((item.fail / item.total) * 100).toFixed(2)
  );
  const series = [
    {
      name: "미인증",
      data: notVerifiedData,
      color: "#BBD6FF",
    },
    {
      name: "성공",
      data: successData,
      color: "#FFAFB0",
    },
    {
      name: "실패",
      data: failData,
      color: "#C8FFC3",
    },
  ];
  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
      stackType: "100%",
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: categories,
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: "right",
      offsetX: 0,
      offsetY: 50,
    },
    tooltip: {
      y: {
        formatter: (val) => `${val}%`, // 비율 값 표시
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        colors: ["#000"], // 글자 색상을 검정(#000)으로 설정
      },
      formatter: (val) => `${val}%`, // 비율 값 표시
    },
  };
  return (
    <div>
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}
