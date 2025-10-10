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
        <div className="flex flex-col w-fit items-center pt-[50px]">
            {/* Wrap chart in a div to capture it */}
            <div className="chart w-full" ref={chartRef}>
                <PieChart width={1050} height={850}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={320}
                        innerRadius={200}
                        labelLine={({ points, stroke }) => {
                            const [start, end] = points;
                            return (
                            <path
                                d={`M${start.x},${start.y}L${end.x},${end.y}`}
                                stroke={stroke}
                                strokeWidth={5}
                                fill="none"
                            />
                            );
                        }}
                        label={({ name, percent, cx, cy, midAngle, outerRadius }) => {
                            const RADIAN = Math.PI / 180;
                            const radius = outerRadius + 40; // ✅ move labels outside the pie
                            const x = cx + radius * Math.cos(-midAngle * RADIAN);
                            const y = cy + radius * Math.sin(-midAngle * RADIAN);

                            return (
                            <text
                                x={x}
                                y={y}
                                fill="#333"
                                textAnchor={x > cx ? "start" : "end"}
                                dominantBaseline="central"
                                style={{
                                fontSize: "48px",  // ✅ nice readable size
                                fontWeight: "600",
                                }}
                            >
                                {`${(percent * 100).toFixed(1)}%`}
                            </text>
                            );
                        }}
                        >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                        wrapperStyle={{
                            paddingTop: "50px", 
                            fontSize: "48px",
                            fontWeight: "600",
                        }}
                    />
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
