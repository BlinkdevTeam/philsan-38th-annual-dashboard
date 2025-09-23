import { useState, useEffect } from "react";
import { getParticipants } from "../../supabase/supabaseService";


const SponsorWidget = (props) => {
    const [participants, setParticipants] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        getParticipants(props.sponsor, "approved")
            .then((res) => setParticipants(res))
            .finally(() => setLoading(false))
    }, [props.sponsor]) // ✅ dependency should be sponsor, not participants!

    return (
        <div 
            onClick={() => props.setUserStatus()} 
            className="sponsor-widget cursor-pointer gap-[10px] justify-center items-center group w-[100%]"
        >
            <div className="flex">
                <div 
                    className={`flex gap-[10px] items-center w-[100%] ${
                        props.userStatus === props.title ? "bg-[#0c3719]" : "bg-[#18622f]"
                    } group-hover:bg-[#124d24] py-[2px] px-[10px] rounded-l-[8px]`}
                >
                    <p className="text-[#ffffff] text-[12px]">{props.title}</p>
                </div>

                <div 
                    className={`h-full ${
                        props.userStatus === props.title ? "bg-[#0c3719]" : "bg-[#18622f]"
                    } group-hover:bg-[#124d24] py-[2px] px-[20px] rounded-r-[8px]`}
                >
                    <div className={`${props.color} flex justify-center items-center`}>
                        {loading ? (
                            // Simple Tailwind spinner
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                            </svg>
                        ) : (
                            participants.length
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default SponsorWidget;