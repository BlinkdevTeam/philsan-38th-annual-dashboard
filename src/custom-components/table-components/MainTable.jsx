import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { 
    getItems, 
    deleteWithCharaters, 
    getSponsorList,
    getParticipants,
    updateItem, 
    deleteItem } from '../../supabase/supabaseService';
import { supabase } from "/supabaseClient";
import { Toaster } from 'react-hot-toast';
import PhilsanLogo from "../../assets/philsan_logo.png"
import Widget from "./Widget";
import SliderModal from "./SliderModal";
import { fetchProofImage } from "./Config/fetchProofImage";
import RegisterParticipant from "./RegisterParticipant";
import SponsorWidget from "./SponsorWidget";
import toast from 'react-hot-toast'
import emailjs from "@emailjs/browser";
import { onApprove, onDelete, onReject, } from "./Config/crudEmailjs";

const MainTable = ({sponsor}) => {
    const [toFilterSponsor, setTofilterSponsor] = useState(null)
    const bucket = 'philsan-proof-of-payments';
    const [selectedCol, setSelectedCol] = useState(null);
    const [proof, setProof] = useState(null);
    const [userStatus, setUserStatus] = useState("Approved");
    const [pendings, setPendings] = useState([]);
    const [approved, setApproved] = useState([]);
    const [invited, setInvited] = useState([]);
    const [canceled, setCanceled] = useState([]);
    const [sponsorList, setSponsorList] = useState([])
    const [searchTerm, setSearchTerm] = useState(null)
    const [searchParticipant, setSearchParticipant] = useState(null)
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



    useEffect(() => {
        if (sponsor && sponsor[0] && sponsor[0].sponsor_name) {
            setTofilterSponsor(sponsor[0].sponsor_name);
        }
    }, [sponsor]);

    useEffect(() => {        
        if (!toFilterSponsor) return;

        const fetchData = () => {
            try {
                getParticipants(toFilterSponsor, "approved").then(setApproved);
                getParticipants(toFilterSponsor, "pending").then(setPendings);
                getParticipants(toFilterSponsor, "canceled").then(setCanceled);
                getSponsorList().then(setSponsorList);
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
                console.log("irelevant", isRelevant)
                if (!isRelevant) return;

                console.log("newdata", newData)
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

    useEffect(() => {
        fetchProofImage({
            selectedCol: selectedCol,
            supabase: supabase,
            setProof: (data) => setProof(data),
            bucket: bucket
        })
    }, [selectedCol]);

    const closeModal = () => {
        setSelectedCol(null)
        setProof(null)
    }

    const setContent = (status, sponsor) => {
        if(sponsor === "All Participants") {
            setUserStatus(status)
            setTofilterSponsor("Philsan Secretariat")
        } else {
            setUserStatus(status)
            setTofilterSponsor(sponsor)
        }
    }

    const handleSearchSponsor = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchParticipant = (e) => {
        setSearchParticipant(e.target.value)
    }

    return (
        <div>
            <Toaster position="top-left" reverseOrder={false} />
            <div className="flex">
                <div className="sidebar flex flex-col justify-between w-[400px] overflow-y-scroll scrollbar-none">
                    <div className={`bg-[#1f783b]`}>
                        <div className={`h-[100vh]`}>
                            <div className="py-[32px]">
                                <div className="w-[100%] flex pl-[20px] pb-[50px]">
                                        <div className="bg-[#dce4df] px-[25px] pb-[5px] pt-[10px] rounded-[10px] flex justify-center">
                                            <img src={PhilsanLogo} alt="" width="150px" />
                                        </div>
                                </div>
                                <div className="px-[20px] pb-[20px]">
                                    <div className="flex flex-col gap-[2px]">
                                        <SponsorWidget
                                            title={'All Participants'}
                                            sponsor={"Philsan Secretariat"}
                                            color={"text-[#f9b700]"}
                                            userStatus={userStatus}
                                            setUserStatus={() => setContent("Approved", "All Participants")}
                                        /> 
                                        <SponsorWidget
                                            title={'Non Sponsored'}
                                            sponsor={"No Sponsor"}
                                            color={"text-[#f9b700]"}
                                            userStatus={userStatus}
                                            setUserStatus={() => setContent("Approved", "No Sponsor")}
                                        /> 
                                    </div>
                                </div>
                                <div className="px-[20px] pb-[20px]">
                                    <p className="text-[12px] text-[#dce4df] opacity-[0.5]">Search sponsor/s</p>
                                    <input 
                                        className="p-[10px] bg-[#dce4df] w-[100%] rounded-lg text-[14px]" 
                                        type="text" 
                                        placeholder="Enter Sponsor" 
                                        onChange={handleSearchSponsor}
                                        value={searchTerm} 
                                    />
                                </div>
                                <div className="h-[600px] pl-[20px] pr-[5px] mr-[20px] overflow-y-scroll overflow-x-hidden scrollbar-custom">
                                    <div className="flex flex-col gap-[2px]">
                                        {   
                                            sponsorList.filter(item =>
                                                (searchTerm == null || searchTerm.trim() === "" || 
                                                item.sponsor_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                                item.sponsor_name !== "Philsan Secretariat"
                                            )
                                            .map((item) => (
                                                <SponsorWidget
                                                    title={item.sponsor_name}
                                                    sponsor={item.sponsor_name}
                                                    color={"text-[#f9b700]"}
                                                    userStatus={userStatus}
                                                    setUserStatus={() => setContent("Approved", item.sponsor_name)}
                                                />
                                            ))
                                        }
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className={`relative w-[100%] h-[100vh] overflow-y-scroll bg-[#dce4df] scrollbar-none p-[40px]`}>
					{ userStatus === "registration" ? 
                        <RegisterParticipant
                            loggedSponsor={toFilterSponsor}
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
                            <div className="flex items-center gap-[10px] pb-[20px]">
                                <Widget
                                    title={"Approved"}
                                    value={approved}
                                    color={"text-[#f9b700]"}
                                    userStatus={userStatus}
                                    setUserStatus={() => setContent("Approved")}
                                />
                                <Widget
                                    title={"Pending"}
                                    value={pendings}
                                    color={"text-[#fb6c6c]"}
                                    userStatus={userStatus}
                                    setUserStatus={() => setContent("Pending")}
                                />
                                <Widget
                                    title={"Canceled"}
                                    value={canceled}
                                    color={"text-[#f9b700]"}
                                    userStatus={userStatus}
                                    setUserStatus={() => setContent("Canceled")}
                                />
                                <button onClick={() => setContent("registration")} className="cursor-pointer py-[8px] px-[10px] bg-[#ffe7a4] text-[14px] rounded-lg">Invite Participant</button>
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
                <SliderModal
                    loggedSponsor={toFilterSponsor}
                    selectedCol={selectedCol}
                    closeModal={() => closeModal()}
                    proof={proof}
                    onApprove={() => onApprove(
                        {
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
        </div>
    )
}

export default MainTable;