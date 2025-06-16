import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { 
    getItems, 
    deleteWithCharaters, 
    getSponsorList,
    getParticipants,
    createSponsor,
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
    const [sponsorPass, setSponsorPass] = useState(null)
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
    const [toAddSponsor, setToAddSponsor] = useState({
        sponsor_name: null,
        password: null,
        errors: {}
    })
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

    const setContent = (status, sponsor, pass) => {
        if(sponsor === "All Participants") {
            setUserStatus(status)
            setTofilterSponsor("Philsan Secretariat")
            setSponsorPass(pass)
        } else {
            setUserStatus(status)
            setTofilterSponsor(sponsor)
            setSponsorPass(pass)
        }
    }

    const handleSearchSponsor = (e) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchParticipant = (e) => {
        setSearchParticipant(e.target.value)
    }

    const handleAddSponsor = (e) => {
        setToAddSponsor(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    }

    const submitAddSponsor = () => {
        const {errors, ...sponsors} = toAddSponsor;
        createSponsor(sponsors)
    }


    return (
        <div>
            <Toaster position="top-left" reverseOrder={false} />
            <div className="flex">
                <div className="sidebar flex flex-col justify-between w-[400px] overflow-y-scroll scrollbar-none">
                    <div className={`bg-[#1f783b]`}>
                        <div className={`h-max`}>
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
                                            setUserStatus={() => setContent("Approved", "All Participants", null)}
                                        /> 
                                        <SponsorWidget
                                            title={'Non Sponsored'}
                                            sponsor={"No Sponsor"}
                                            color={"text-[#f9b700]"}
                                            userStatus={userStatus}
                                            setUserStatus={() => setContent("Approved", "No Sponsor", null)}
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
                                <div className="h-[450px] pl-[20px] pr-[5px] mr-[20px] overflow-y-scroll overflow-x-hidden scrollbar-custom">
                                    <div className="flex flex-col gap-[2px]">
                                        {   
                                            sponsorList.filter(item =>
                                                (searchTerm == null || searchTerm.trim() === "" || 
                                                item.sponsor_name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                                                item.sponsor_name !== "Philsan Secretariat"
                                            )
                                            .map((item) => (
                                                <div className="flex w-[100%] items-center gap-[5px]">
                                                    <svg className="cursor-pointer" width="12" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fill="#709b7d" d="M7 8C7 7.44772 6.55228 7 6 7C5.44772 7 5 7.44772 5 8H7ZM5 16C5 16.5523 5.44772 17 6 17C6.55228 17 7 16.5523 7 16H5ZM11 8C11 7.44772 10.5523 7 10 7C9.44771 7 9 7.44772 9 8H11ZM9 16C9 16.5523 9.44771 17 10 17C10.5523 17 11 16.5523 11 16H9ZM3.09202 18.782L3.54601 17.891H3.54601L3.09202 18.782ZM2.21799 17.908L3.10899 17.454L3.10899 17.454L2.21799 17.908ZM13.782 17.908L12.891 17.454V17.454L13.782 17.908ZM12.908 18.782L12.454 17.891H12.454L12.908 18.782ZM1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6V4ZM15 6C15.5523 6 16 5.55228 16 5C16 4.44771 15.5523 4 15 4V6ZM3.5 5C3.5 5.55228 3.94772 6 4.5 6C5.05228 6 5.5 5.55228 5.5 5H3.5ZM10.5 5C10.5 5.55228 10.9477 6 11.5 6C12.0523 6 12.5 5.55228 12.5 5H10.5ZM5 8V16H7V8H5ZM9 8V16H11V8H9ZM13 5V15.8H15V5H13ZM10.8 18H5.2V20H10.8V18ZM1 5V15.8H3V5H1ZM5.2 18C4.62345 18 4.25117 17.9992 3.96784 17.9761C3.69617 17.9539 3.59545 17.9162 3.54601 17.891L2.63803 19.673C3.01641 19.8658 3.40963 19.9371 3.80497 19.9694C4.18864 20.0008 4.65645 20 5.2 20V18ZM1 15.8C1 16.3436 0.999222 16.8114 1.03057 17.195C1.06287 17.5904 1.13419 17.9836 1.32698 18.362L3.10899 17.454C3.0838 17.4045 3.04612 17.3038 3.02393 17.0322C3.00078 16.7488 3 16.3766 3 15.8H1ZM3.54601 17.891C3.35785 17.7951 3.20487 17.6422 3.10899 17.454L1.32698 18.362C1.6146 18.9265 2.07354 19.3854 2.63803 19.673L3.54601 17.891ZM13 15.8C13 16.3766 12.9992 16.7488 12.9761 17.0322C12.9539 17.3038 12.9162 17.4045 12.891 17.454L14.673 18.362C14.8658 17.9836 14.9371 17.5904 14.9694 17.195C15.0008 16.8114 15 16.3436 15 15.8H13ZM10.8 20C11.3436 20 11.8114 20.0008 12.195 19.9694C12.5904 19.9371 12.9836 19.8658 13.362 19.673L12.454 17.891C12.4045 17.9162 12.3038 17.9539 12.0322 17.9761C11.7488 17.9992 11.3766 18 10.8 18V20ZM12.891 17.454C12.7951 17.6422 12.6422 17.7951 12.454 17.891L13.362 19.673C13.9265 19.3854 14.3854 18.9265 14.673 18.362L12.891 17.454ZM1 6H2V4H1V6ZM2 6H14V4H2V6ZM14 6H15V4H14V6ZM5.5 4.2C5.5 3.06743 6.53305 2 8 2V0C5.60095 0 3.5 1.79795 3.5 4.2H5.5ZM8 2C9.46695 2 10.5 3.06743 10.5 4.2H12.5C12.5 1.79795 10.399 0 8 0V2ZM3.5 4.2V5H5.5V4.2H3.5ZM10.5 4.2V5H12.5V4.2H10.5Z"/>
                                                    </svg>
                                                    <SponsorWidget
                                                        title={item.sponsor_name}
                                                        sponsor={item.sponsor_name}
                                                        color={"text-[#f9b700]"}
                                                        userStatus={userStatus}
                                                        setUserStatus={() => setContent("Approved", item.sponsor_name, item.password)}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                <div className="pt-[40px] px-[20px]">
                                    <div className="px-[10px] py-[20px] bg-[#18622f] rounded-lg">
                                        <div className="px-[20px] pb-[5px]">
                                            <p className="text-[10px] text-[#dce4df] opacity-[0.5]">Add new sponsor</p>
                                            <input 
                                                className="p-[8px] bg-[#dce4df] w-[100%] rounded-lg text-[12px]" 
                                                name="sponsor_name"
                                                type="text" 
                                                placeholder="Enter Sponsor Name" 
                                                onChange={handleAddSponsor}
                                                value={toAddSponsor.sponsor_name} 
                                            />
                                        </div>
                                        <div className="px-[20px] pb-[5px]">
                                            <p className="text-[10px] text-[#dce4df] opacity-[0.5]">Create Password</p>
                                            <input 
                                                className="p-[8px] bg-[#dce4df] w-[100%] rounded-lg text-[12px]" 
                                                name="password"
                                                type="text" 
                                                placeholder="Enter Password" 
                                                onChange={handleAddSponsor}
                                                value={toAddSponsor.password} 
                                            />
                                        </div>
                                        <div className="px-[20px]">
                                            <button onClick={submitAddSponsor} className="text-[12px] py-[3px] px-[10px] bg-[#ffe7a4] rounded-md cursor-pointer">Add Sponsor</button>
                                        </div>
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
                            <div className="flex items-center pb-[20px] justify-between">
                                <div className="flex items-center gap-[10px]">
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
                                <div>
                                    {
                                        toFilterSponsor !== "Philsan Secretariat" && toFilterSponsor !== "No Sponsor" &&
                                        <div className="flex flex-col gap-[1px]">
                                            <p className="text-[12px]">Sponsor: <strong>{toFilterSponsor}</strong></p>
                                            <p className="text-[12px]">Password: <strong>{sponsorPass}</strong></p>
                                        </div>
                                    }
                                </div>
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