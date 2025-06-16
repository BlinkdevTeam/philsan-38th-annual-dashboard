import { useState, useEffect } from "react";
import { getParticipants } from "../../supabase/supabaseService";

const SponsorWidget = (props) => {
    const [participants, setParticipants] = useState([])

    useEffect(() => {
        getParticipants(props.sponsor, "approved").then(setParticipants)
    }, [participants])

    return(
        <div onClick={() => props.setUserStatus()} className="cursor-pointer gap-[10px] justify-center items-center group w-[100%]">
            <div className="flex bg-[]">
                <div className={`flex gap-[10px] items-center w-[100%] ${props.userStatus === props.title ? "bg-[#0c3719]" : "bg-[#18622f]"} group-hover:bg-[#124d24] py-[2px] px-[10px] rounded-l-[8px]`}>
                    <p className="text-[#ffffff] text-[12px]">{props.title}</p>
                </div>
                <div className={`h-[100%] ${props.userStatus === props.title ? "bg-[#0c3719]" : "bg-[#18622f]"} group-hover:bg-[#124d24] py-[2px] px-[20px] rounded-r-[8px]`}>
                    <div className={`${props.color} flex justify-center items-center`}>{participants && participants.length}</div>
                </div>
            </div>
        </div>
    )
}

export default SponsorWidget;