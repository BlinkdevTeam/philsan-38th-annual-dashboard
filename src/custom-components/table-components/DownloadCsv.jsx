import { useState, useEffect } from "react"


const DownloadCsv = (props) => {

    const convertToCSV = (objArray) => {
        const array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
        const keys = Object.keys(array[0]);
        const csvRows = [
            keys.join(","), // header row
            ...array.map(row => keys.map(k => JSON.stringify(row[k] || "")).join(","))
        ];
        return csvRows.join("\n");
    };

    const downloadCSV = () => {
        const csv = convertToCSV(props.data);
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "export.csv";
        a.click();
        window.URL.revokeObjectURL(url);
    };


    return (
        <div className={`rounded-lg flex cursor-pointer py-[5px] px-[20px] gap-[10px] justify-center items-center h-max bg-[#acc5b4] hover:bg-[#ffe7a4] w-[150px]`}>
            <button className="text-[12px] cursor-pointer" onClick={downloadCSV}>Download CSV</button>
        </div>
    )
}

export default DownloadCsv;