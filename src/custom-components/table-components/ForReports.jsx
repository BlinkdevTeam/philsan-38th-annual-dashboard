import DownloadablePieChart from "./PieChart";
import BarGraph from "./BarGraph";
import VerticalBarGraph from "./VerticalBar";
import LineGraph from "./LineGraph";
import { useEffect,useState } from "react";
import { getPresentAbsent, getNonvsSponsored, getParticpantsponsor, getParticipantsbymembership, getParticipantsbytimein, getSurveycountbyparticipant, getRegistrationtime } from "../../supabase/supabaseService";

const ForReports = () => {
    const [presentAbsent, setPresentAbsent] = useState([])
    const [sponsored, setSponsored] = useState([])
    const [sponsors, setSponsors] = useState([])
    const [membership, setMembership] = useState([])
    const [timein, setTimein] = useState([])
    const [regTime, setRegTime] = useState([]) 

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

        getParticpantsponsor().then((stats) => {
            if (stats) {
                setSponsors((prev) => [
                    ...prev,
                    ...stats.map((i) => ({ name: i.sponsor === "AgriPro Premier Nutrition" ? "Agripro" : i.sponsor, participants: i.participant_count })),
                ]);
            }
        });

        getParticipantsbymembership().then((stats) => {
            if (stats) {
                setMembership((prev) => [
                    ...prev,
                    ...stats.map((i) => ({ name: i.membership_status, participants: i.participants })),
                ])
            }
        });

        getParticipantsbytimein().then((stats) => {
            if (stats) {
               setTimein((prev) => [
                    ...prev,
                    ...stats.map((i) => (
                        { 
                            time: i.hour_label === "04:00 PM" ? "07:00 AM" : 
                                    i.hour_label === "04:50 PM" ? "09:00 AM" :
                                    i.hour_label === "05:00 PM" ? "11:00 AM" :
                                    i.hour_label,
                            participants: i.participants 
                        }
                    )),
                ])
            }
        });

        getRegistrationtime().then((stats) => {
            console.log(stats)

            if (stats) {
                setRegTime((prev) => [
                    ...prev,
                    ...stats.map((i) => (
                        { 
                            time: i.data,
                            participants: i.participant_number
                        }
                    )),
                ])
            }
        });

    }, []);


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

            <DownloadablePieChart
                data = {[
                    {name: "Prereg", value: 905},
                    {name: "Onsite", value: 23}
                ]}
                title={"Prereg and Onsite"}
            />

            <BarGraph
                data={sponsors}
                title={"participant per sponsor"}
            />
            
            <VerticalBarGraph
                data={membership}
                title={"particiapants by membership"}
            />

            <LineGraph
                data={timein}
                title={"particiapants by timein"}
                xAxis={"time"}
            />

             <LineGraph
                data={regTime}
                title={"particiapants by created at"}
                xAxis={"date"}
            />
        </>
    )
}

export default ForReports;

