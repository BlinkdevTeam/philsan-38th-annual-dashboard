import { useState, useEffect } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { onSave } from "./Config/crudEmailjs";
import { 
    getParticipants,
    createSponsor,
    deleteSponsor } from '../../supabase/supabaseService';
import PhilsanLogo from "../../assets/philsan_logo.png"
import { supabase } from "/supabaseClient";
import { Toaster } from 'react-hot-toast';
import SliderModal from "./SliderModal";
import SponsorSliderModal from "./SponsorSliderModal";
import RegisterParticipant from "./RegisterParticipant";
import Widget from "./Widget";
import UploadCsv from "./UploadCsv";


const SponsorMaintable = ({sponsor}) => {
    const [toFilterSponsor, setTofilterSponsor] = useState(null)
    const [sponsorPass, setSponsorPass] = useState(null)
    const [userStatus, setUserStatus] = useState("Approved");
    const [selectedCol, setSelectedCol] = useState(null);
    const [searchParticipant, setSearchParticipant] = useState(null)
    const [pendings, setPendings] = useState([]);
    const [approved, setApproved] = useState([]);
    const [invited, setInvited] = useState([]);
    const [canceled, setCanceled] = useState([]);
    const [proof, setProof] = useState(null);
    const userRegStats = userStatus === "Approved" ? approved : 
                        userStatus === "Pending" ? pendings :
                        userStatus === "Invited" ? invited : 
                        userStatus === "Canceled" && canceled
    const filteredData = userRegStats.filter((item) => {
        if (!searchParticipant || searchParticipant.trim() === "") return true;

        const lower = searchParticipant.toLowerCase();

        return (
            item.email?.toLowerCase().includes(lower) ||
            item.first_name?.toLowerCase().includes(lower) ||
            item.last_name?.toLowerCase().includes(lower) ||
            item.middle_name?.toLowerCase().includes(lower) ||
            item.sponsor?.toLowerCase().includes(lower)
        );
    });
    const [goToRegsitration, setgoToRegistration] = useState(null)



    useEffect(() => {
        if (sponsor && sponsor[0] && sponsor[0].sponsor_name) {
            setTofilterSponsor(sponsor[0].sponsor_name);
            setSponsorPass(sponsor[0].password)
        }
    }, [sponsor]);

    useEffect(() => {        
            if (!toFilterSponsor) return;
    
            const fetchData = () => {
                try {
                    getParticipants(toFilterSponsor, "approved").then(setApproved);
                    getParticipants(toFilterSponsor, "pending").then(setPendings);
                    getParticipants(toFilterSponsor, "canceled").then(setCanceled);
                } catch (err) {
                    console.error("Fetch error:", err);
                }
            };
    
            fetchData();
    
            const channel = supabase
                .channel("realtime:philsan_registration_2025")
                .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "philsan_registration_2025",
                },
                (payload) => {
                    // console.log("🔁 Realtime payload:", payload);
    
                    const { new: newData } = payload;
    
                    // Only update if this is the same sponsor
                    const isRelevant = toFilterSponsor === "Philsan Secretariat" || newData.sponsor === toFilterSponsor;
                    if (!isRelevant) return;
    
                    updateByStatus(newData);
                }
                ).subscribe();
    
            const updateByStatus = (data) => {
                const updateState = (setter) => {
                setter((prev) => {
                    const exists = prev.find((item) => item.id === data.id);
                    return exists
                    ? prev.map((item) => (item.id === data.id ? data : item))
                    : [data, ...prev];
                });
                };
    
                switch (data.reg_status) {
                    case "pending":
                        updateState(setPendings);
                        break;
                    case "invited":
                        updateState(setInvited);
                        break;
                    case "canceled":
                        updateState(setCanceled);
                        break;
                    case "approved":
                        updateState(setApproved);
                        break;
                }
            };
    
            return () => {
                supabase.removeChannel(channel);
            };
        }, [toFilterSponsor]);


    const handleSearchParticipant = (e) => {
        setSearchParticipant(e.target.value)
    }

    const setContent = (status, sponsor, pass) => {
        if(sponsor === "All Participants") {
            setUserStatus(status)
            setTofilterSponsor("Philsan Secretariat")
            setSponsorPass(pass)
            handleGotoReg(null)
        } else {
            setUserStatus(status)
            setTofilterSponsor(sponsor)
            setSponsorPass(pass)
            handleGotoReg(null)
        }
    }


    const closeModal = () => {
        setSelectedCol(null)
        setProof(null)
    }

    const handleGotoReg = (reg) => {
        console.log("reg", reg)
        setgoToRegistration(reg)
    }

    
    return (
        <div className="flex p-[30px] bg-[#1f783b] relative">
            <div className={`relative w-[100%] h-[100vh] overflow-y-scroll bg-[#dce4df] scrollbar-none pb-[40px] rounded-lg`}>
                <div className="bg-[#dce4df] px-[25px] py-[20px] rounded-t-[10px] flex justify-between items-center shadow">
                    <img src={PhilsanLogo} alt="" width="150px" />
                    <div className="flex gap-[20px] items-center">
                        <Widget
                            title={"Approved"}
                            value={approved}
                            color={"text-[#f9b700]"}
                            userStatus={userStatus}
                            setUserStatus={() => setContent("Approved", toFilterSponsor, sponsorPass)}
                            
                        />
                        <Widget
                            title={"Pending"}
                            value={pendings}
                            color={"text-[#fb6c6c]"}
                            userStatus={userStatus}
                            setUserStatus={() => setContent("Pending", toFilterSponsor, sponsorPass)}
                        />
                         <Widget
                            title={"Canceled"}
                            value={canceled}
                            color={"text-[#f9b700]"}
                            userStatus={userStatus}
                            setUserStatus={() => setContent("Canceled", toFilterSponsor, sponsorPass)}
                        />
                        <div  onClick={() => handleGotoReg("bulk")} className="cursor-pointer py-[8px] px-[10px] bg-[#ffe7a4] text-[14px] rounded-lg">
                            <button  className="text-[12px] text-[#000000] cursor-pointer"><strong>Bulk</strong> Registration via CSV</button>
                        </div>
                        <button onClick={() => handleGotoReg("single")} className="cursor-pointer py-[8px] px-[10px] bg-[#ffe7a4] text-[14px] rounded-lg">Register New Participant</button>
                        <div className="bg-[#1f783b] py-[8px] px-[20px] text-[#dce4df] text-[11px] rounded-lg">
                            <p className="font-[200]">Sponsor: <span className="font-[800]">{toFilterSponsor}</span></p>
                            <p className="font-[200]">Password: <span className="font-[800]">{sponsorPass}</span></p>
                        </div>
                    </div>
                </div>
                <div className="px-[40px] pt-[40px]">
                    {
                        goToRegsitration ? 
                            goToRegsitration === "single" ?
                                <div className="pt-[50px]">
                                    <RegisterParticipant
                                        loggedSponsor={toFilterSponsor}
                                        setgoToRegistration={() => handleGotoReg(null)}
                                    />
                                </div> : 
                            goToRegsitration === "bulk" && 
                                <UploadCsv
                                    loggedSponsor={toFilterSponsor}
                                    setgoToRegistration={() => handleGotoReg(null)}
                                /> :
                        <div>
                            <div className="flex gap-[20px] mb-[20px]">
                                <input 
                                    className={`bg-[#bfcec4] w-[100%] py-[10px] pr-[10px] pl-[20px] text-[#000000]`} 
                                    type="text" 
                                    placeholder="Enter Keyword" 
                                    value={searchParticipant}
                                    onChange={handleSearchParticipant}
                                />
                            </div>
                            <DataTable
                                highlightOnHover
                                columns={columns()}
                                data={filteredData}
                                striped 
                                theme={"philsan"}
                                pagination
                                onRowClicked={row => setSelectedCol(row)}
                                // conditionalRowStyles={conditionalRowStyles}
                            />
                        </div>
                    }
                </div>
            </div>
            <SponsorSliderModal
                loggedSponsor={toFilterSponsor}
                selectedCol={selectedCol}
                closeModal={() => closeModal()}
                proof={proof}
                onApprove={(data) => onSave(
                    {
                        data: data,
                        selectedCol: selectedCol,
                        closeModal: () => closeModal()
                    }
                )}
                onReject={() => onReject(
                    {
                        selectedCol: selectedCol,
                        closeModal: () => closeModal()
                    }
                )}
                onDelete={() => onDelete(
                    {
                        selectedCol: selectedCol,
                        closeModal: () => closeModal()
                    }
                )}
            />
        </div>
    )
}

export default SponsorMaintable