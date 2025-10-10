import React, { useRef } from "react";
import html2canvas from "html2canvas";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label, xAxis }) => {
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

const LineGraph = (props) => {
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
    link.download = `${props.title || "line-chart"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="w-[100%]">
      <div
        ref={chartRef}
        style={{
          backgroundColor: "rgb(255,255,255)",
          color: "rgb(51,51,51)",
          width: "100%",
          height: "750px",
          padding: "16px",
          borderRadius: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "#333",
            paddingBottom: "20px",
          }}
        >
          {props.title}
        </h2>

        <ResponsiveContainer width="85%" height="85%">
          <LineChart data={props.data}>
            <CartesianGrid stroke="#e0e0e0" />
            <XAxis
                dataKey="time"
                tick={{ fill: "#555555", angle: -45, textAnchor: "end" }} // <--- rotated ticks
                label={{
                    value: "Date",
                    position: "insideBottom",
                    offset: -5,
                    fill: "#333",
                }}
                height={60} // increase height to give space for slanted labels
            />
            <YAxis
              tick={{ fill: "#555555" }}
              label={{
                value: "Participants",
                angle: -90,
                position: "insideLeft",
                fill: "#333",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="participants"
              stroke="#4caf50"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7, stroke: "#0a875a", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "12px",
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
        >
          Download {props.title}
        </button>
      </div>
    </div>
  );
};

export default LineGraph;
