import React, { useRef } from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import html2canvas from "html2canvas";




export default function DownloadablePieChart(props) {

    const data = props.data    
    const COLORS = ["#1f783b", "#bfcec4", "#0088FE", "#FF8042"];

    const chartRef = useRef();

    const downloadChart = async () => {
        if (!chartRef.current) return;
        const canvas = await html2canvas(chartRef.current);
        const link = document.createElement("a");
        link.download = "pie-chart.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="flex flex-col w-fit items-center">
            {/* Wrap chart in a div to capture it */}
            <div className="chart w-fit" ref={chartRef}>
                <PieChart width={500} height={400}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    innerRadius={70}
                    label>
                    {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
                </PieChart>
            </div>

            {/* Download button */}
            <button
                onClick={downloadChart}
                style={{ marginTop: "10px", padding: "8px 50px", cursor: "pointer" }}

                className="bg-[#dce4df] w-fit"
            >
                Download <span className="font-[700] text-[14px]">{props.title}</span>
            </button>
        </div>
    );
}
