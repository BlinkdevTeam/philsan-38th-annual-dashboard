import DownloadablePieChart from "./PieChart";
import { useEffect,useState } from "react";
import { getPresentAbsent, getNonvsSponsored } from "../../supabase/supabaseService";

const ForReports = () => {
    const [presentAbsent, setPresentAbsent] = useState([])
    const [sponsored, setSponsored] = useState([])

    useEffect(() => {
        getPresentAbsent().then((stats) => {
            if (stats) {
                setPresentAbsent([
                    {name: "Present", value: stats.attended},
                    {name: "Absent", value: stats.absent}
                ])
            }
        });

        getNonvsSponsored().then((stats) => {
            if (stats) {
                setSponsored([
                    {name: "Sponsored", value: stats.sponsored},
                    {name: "Non-Sponsored", value: stats.non_sponsored}
                ])
            }
        });

    }, []);

    console.log(presentAbsent)

    return(
        <>
            <DownloadablePieChart
                data = {presentAbsent}
                title={"Present/Absent"}
            />

            <DownloadablePieChart
                data = {sponsored}
                title={"Sponsored Vs Non"}
            />
        </>
    )
}

export default ForReports;

