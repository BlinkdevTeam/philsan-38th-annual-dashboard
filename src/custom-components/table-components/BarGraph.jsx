import React, { useRef } from "react";
import html2canvas from "html2canvas";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "rgb(255,255,255)",
          padding: "8px",
          borderRadius: "8px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
          fontSize: "14px",
          border: "1px solid rgb(220,220,220)",
          color: "rgb(50,50,50)",
        }}
      >
        <p style={{ fontWeight: "600" }}>{label}</p>
        <p>{payload[0].value} participants</p>
      </div>
    );
  }
  return null;
};

const BarGraph = (props) => {
  const chartRef = useRef(null);

  const handleDownload = async () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    const canvas = await html2canvas(chartElement, {
      backgroundColor: "#ffffff",
      useCORS: true,
      scale: 2,
    });

    const link = document.createElement("a");
    link.download = "sponsor-bar-chart.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-[50%]">
        <div
            ref={chartRef}
            style={{
                backgroundColor: "rgb(255,255,255)",
                color: "rgb(51,51,51)",
                width: "100%",
                height: "750px",
                padding: "16px",
            }}
        >
             <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#333", paddingBottom: "20px"}}>{props.title}</h2>
            <ResponsiveContainer width="80%" height="85%">
                <BarChart
                    data={props.data}
                    layout="vertical" // 🔹 makes the chart horizontal

                >
                <CartesianGrid stroke="#e0e0e0" />
                <XAxis
                    type="number"
                    tick={{ fill: "#555555" }}
                    domain={[0, "dataMax + 100"]} // adjust the right-side margin if needed
                    ticks={[0, 300, 600, 900]} // ✅ divide by 300
                />
                <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fill: "#555555" }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                    dataKey="participants"
                    fill="#4caf50"
                    radius={[0, 5, 5, 0]} // rounded right corners for horizontal bars
                    barSize={20}
                />
                </BarChart>
            </ResponsiveContainer>
        </div>
            <div
                style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
                }}
            >
                <button
                    onClick={handleDownload}
                    style={{
                        backgroundColor: "#0a875a",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "6px 12px",
                        cursor: "pointer",
                    }}
                >Download {props.title}</button>
            </div>
    </div>
  );
};

export default BarGraph;
