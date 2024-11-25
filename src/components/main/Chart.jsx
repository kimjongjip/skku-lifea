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
      name: "Not Verified",
      data: notVerifiedData,
    },
    {
      name: "Success",
      data: successData,
    },
    {
      name: "Fail",
      data: failData,
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
      categories: categories, // X축에 날짜 표시
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
