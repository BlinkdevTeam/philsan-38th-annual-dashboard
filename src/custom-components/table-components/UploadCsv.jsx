import { useState, useEffect } from "react"
import { supabase } from "/supabaseClient"
import DataTable from "react-data-table-component"
import { columnsBulk } from "./columnsBulk"


const UploadCsv = (props) => {
    const [dataEntry, setDataEntry] = useState([])
    const [failed, setFailed] = useState([])

    const allowedFields = [
         "email",
        "first_name",
        "middle_name",
        "last_name",
        "mobile",
        "company",
        "position",
        "agri_license",
        "membership",
        "certificate_needed"
    ];

    const forcedValues = {
        reg_status: "pending",            // set default status
        reg_date: new Date().toISOString(), // timestamp
        reg_request: new Date().toISOString(), // timestamp
        sponsor: props.loggedSponsor,
        registered_by: "sponsor"
    };

    const processCSVData = async () => {
        for (const row of dataEntry) {
            const email = row.email?.toLowerCase();
            const firstName = row.first_name
            const middleName = row.middle_name
            const lastName = row.last_name
            const mobile = row.mobile
            const company = row.company
            const position = row.position
            const agriLicense = row.agri_license 
            const membership = row.membership
            const certificateNeeded = row.certificate_needed
            const sponsor = row.sponsor
            const condition = !firstName || !middleName || !lastName || !mobile || !company || !position || !agriLicense || !membership || !certificateNeeded || !sponsor;

            if (!email) continue;
            
            if(condition) {
                setDataEntry(prev =>
                    prev.map(item =>
                    item.email === email
                        ? { ...item, upload_failed: "Missing info Please enter N/A if not applicable" }
                        : item
                    )
                );
            } else {
                const { data: existing } = await supabase
                .from("philsan_registration_2025")
                .select("id")
                .eq("email", email)
                .maybeSingle();

                if (!existing) {
                    const { error } = await supabase
                    .from("philsan_registration_2025")
                    .insert([row]);

                    if (error) {
                        console.error(`Failed to insert ${email}:`, error.message);
                    } else {
                        setDataEntry(prev =>
                            prev.map(item =>
                            item.email === email
                                ? { ...item, upload_success: "Success!!" }
                                : item
                            )
                        );
                    }
                } else {
                    setDataEntry(prev =>
                        prev.map(item =>
                        item.email === email
                            ? { ...item, upload_failed: "Already exists" }
                            : item
                        )
                    );
                }
            }
        }
    };

    const handleCSVUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const rows = text.split("\n").map(row => row.split(",").map(cell => cell.trim()));
        const headers = rows[0].map(h => h.toLowerCase());

        const entries = rows.slice(1).map(row => {
            const entry = {};
            
            row.forEach((cell, i) => {
                const key = headers[i];
                if (allowedFields.includes(key)) {
                    entry[key] = cell;
                }
            });

            // Apply forced values here so it's always fresh
            return {
                ...entry,
                reg_status: "pending",
                reg_date: new Date().toISOString(),
                reg_request: new Date().toISOString(), // timestamp
                sponsor: props.loggedSponsor,
                registered_by: "sponsor"
            };
        });
        setDataEntry(entries);
    };


    return (
        <div className="w-[100%]">
            <div className="max-w-[1200]">
                <div className={`flex ${dataEntry.length === 0 ? "justify-between" : "pt-[50px]"}`}>
                    <div className={`w-[100%] flex items-center ${dataEntry.length === 0 ? "h-[80vh] justify-center" : "justify-start"}`}>
                        <div className={`rounded-lg ${dataEntry.length === 0 ? "shadow-md bg-[#ffffff] px-[30px] pt-[40px] pb-[40px]" : "pb-[20px]"}`}>
                            <div className="rounded-lg flex cursor-pointer py-[5px] px-[20px] gap-[10px] justify-center items-center h-max bg-[#acc5b4] hover:bg-[#ffe7a4] w-max">
                                <input
                                    type="file"
                                    accept=".csv"
                                    className="text-[12px] cursor-pointer w-max"
                                    onChange={handleCSVUpload}
                                />
                            </div>
                        </div>
                    </div>
                    {dataEntry.length > 0 &&
                        <div>
                            <button onClick={processCSVData} className="rounded-lg flex cursor-pointer py-[5px] px-[20px] gap-[10px] justify-center items-center h-max bg-[#acc5b4] hover:bg-[#ffe7a4] w-max text-[12px] text-[#000000]">Submit Entries</button>
                        </div>
                    }
                </div>
                {
                    dataEntry.length > 0 &&
                    <DataTable
                        highlightOnHover
                        columns={columnsBulk()}
                        data={dataEntry}
                        striped 
                        theme={"philsan"}
                        pagination
                        // onRowClicked={row => setSelectedCol(row)}
                        // conditionalRowStyles={conditionalRowStyles}
                    />
                }
            </div>
        </div>
    )
}

export default UploadCsv;