import React, {useState, useEffect} from "react"

const ApiFetcher = ({setSponsorIn}) => {
    useEffect(() => {
         const fetchApi = async () => {
            
        try {
            const response = await fetch("https://ugnaypalay.philrice.gov.ph:441/csd/37th/api/getParticipants", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "API-Key": "yDNpoaxodzxNGJPaynIaEb72sGF2GfCX1KmVS",
            },
            body: JSON.stringify({
                participantId: "118",
            }),
            });

            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log("Fetched Data:", result);
            setData(result);
            if (setSponsorIn) setSponsorIn(result);
        } catch (err) {
            console.error("Error fetching API:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

        fetchApi();
    }, [])
    
    return (
        <div className="w-[100%]">
            <div className="max-w-[1200] mx-auto">
                <div className="flex">
                    <div className=" w-[100%] flex justify-center items-center h-[100vh]">
                       
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApiFetcher