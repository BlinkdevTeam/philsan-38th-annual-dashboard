import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { handleAddSponsor } from "./Config/handleAddSponsor";
import { 
    getSponsorList,
    getParticipants,
    createSponsor,
    deleteSponsor,
    updateTimein
} from '../../supabase/supabaseService';
import { supabase } from "/supabaseClient";
import { Toaster } from 'react-hot-toast';
import Widget from "./Widget";
import SliderModal from "./SliderModal";
import { fetchProofImage } from "./Config/fetchProofImage";
import RegisterParticipant from "./RegisterParticipant";
import PhilsanLogo from "../../assets/philsan_logo.png"
import SponsorWidget from "./SponsorWidget";
import toast from 'react-hot-toast'
import emailjs from "@emailjs/browser";
import { onApprove, onDelete, onReject, } from "./Config/crudEmailjs";
import DownloadCsv from "./DownloadCsv";
import UploadCsv from "./UploadCsv";
import Sidebar from "./Sidebar";

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
    const [searchTerm, setSearchTerm] = useState("")
    const [searchParticipant, setSearchParticipant] = useState("")
    const [toAddSponsor, setToAddSponsor] = useState({
        sponsor_name: "",
        password: "",
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
    const [openPopupId, setOpenPopupId] = useState(null);
    const [goToRegsitration, setgoToRegistration] = useState(false)
    const [sidebarStatus, setSidebarStatus] = useState(false)

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
                console.log("trigger this error first")
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

                    // updateByStatus(newData);

                    fetchData();
                }
            ).subscribe();

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

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const closeModal = (action, data) => {
        if(action === "approve") {
            toast.success(data.first_name + " " + data.last_name + " was APPROVED") 
        } else if(action === "cancel") {
            toast.success(data.first_name + " " + data.last_name + " was CANCELED") 
        } else if(action === "delete") {
            toast.success("Account was DELETED") 
        }
        setSelectedCol(null)
        setProof(null)
    }

    const setContent = (status, sponsor, pass) => {
        console.log('status', status)
        
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

    const handleSearchSponsor = (e) => {
        
        setSearchTerm(e.target.value)
    }

    const handleSearchParticipant = (e) => {
        setSearchParticipant(e.target.value)
    }
    
    const handleTime = (e) => {
        const messages = {
            "time-in": "Time-IN Successful",
            "time-out": "Time-OUT Successful",
            "delete-timein": "Time-IN DELETED",
            "delete-timeout": "Time-OUT DELETED",
        };

        updateTimein({ email: selectedCol.email, action: e.action }).then(() => {
            toast.success(messages[e.action]);
            setSelectedCol(null);
            setProof(null);
        });
    };


    const submitAddSponsor = () => {
        const {errors, ...sponsors} = toAddSponsor;
        createSponsor(sponsors)
    }

    const handleDeleteSponsor = (item) => {
        deleteSponsor({id: item.id, name: item.sponsor_name})
    }

    const handleDelPopup = (id, index) => {
        setOpenPopupId(prev => (prev === id ? null : id));
        // handleDeleteSponsor(item, index)
    }

    const handleOutsideClick = (e) => {
        if (!e.target.closest(".popup")) {
            setOpenPopupId(null);
        }
    };

    
    const handleGotoReg = (reg) => {
        setgoToRegistration(reg)
    }

    const openSidebar = () => {

    }

    return (
        <div>
            <Toaster position="top-left" reverseOrder={false} />
            <div className="flex">
                <Sidebar
                    setContent={(e) => setContent(e.status, e.sponsor, e.pass)}
                    handleSearchSponsor={handleSearchSponsor}
                    handleAddSponsor={handleAddSponsor}
                    useStatus={userStatus}
                    sponsorList={sponsorList}
                    toAddSponsor={toAddSponsor}
                    setToAddSponsor={setToAddSponsor}
                    submitAddSponsor={submitAddSponsor}
                    openPopupId={openPopupId}
                    handleDelPopup={handleDelPopup}
                    handleDeleteSponsor={handleDeleteSponsor}
                    searchTerm={searchTerm}
                    sidebarStatus={sidebarStatus}
                    setSidebarStatus={setSidebarStatus}
                />
				<div className={`relative w-[100%] h-[100vh] overflow-y-scroll bg-[#dce4df] scrollbar-none p-[20px] lg:p-[40px]`}>
					{ goToRegsitration ? 
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
                            <div className="flex flex-col md:flex-row gap-[20px] lg:gap-[20px] mb-[20px] items-center">
                                <div onClick={() => setSidebarStatus(!sidebarStatus)} className="block lg:hidden bg-[#ffffff] px-[25px] pb-[5px] pt-[10px] rounded-[10px] flex justify-center w-[150px] h-[100%]">
                                    <img src={PhilsanLogo} alt="" />
                                </div>
                                <input 
                                    className={`bg-[#bfcec4] w-[100%] py-[10px] pr-[10px] pl-[20px] text-[#000000]`} 
                                    type="text" 
                                    placeholder="Enter Keyword" 
                                    value={searchParticipant}
                                    onChange={handleSearchParticipant}
                                />
                            </div>
                            <div className="flex items-start pb-[20px] justify-between">
                                <div className="flex flex-wrap md:flex-no-wrap items-center gap-[10px]">
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
                                    {/* <div  onClick={() => handleGotoReg("bulk")} className="hidden md:block cursor-pointer py-[8px] px-[10px] bg-[#ffe7a4] text-[14px] rounded-lg">
                                        <button  className="text-[12px] text-[#000000] cursor-pointer"><strong>Bulk</strong> Registration via CSV</button>
                                    </div>
                                    <button onClick={() => handleGotoReg("single")} className="cursor-pointer py-[8px] px-[10px] bg-[#ffe7a4] text-[14px] rounded-lg">Register New Participant</button> */}
                                    <div className="bg-[#1f783b] py-[8px] px-[20px] text-[#dce4df] text-[11px] rounded-lg block lg:hidden">
                                        <p className="font-[200]">Sponsor: <span className="font-[800]">{toFilterSponsor}</span></p>
                                        <p className="font-[200]">Password: <span className="font-[800]">{sponsorPass}</span></p>
                                    </div>
                                </div>
                                <div className="items-center gap-[10px] hidden justify-end lg:flex">
                                    <DownloadCsv
                                        data={filteredData}
                                    />
                                    <div>
                                        {
                                            toFilterSponsor !== "Philsan Secretariat" && toFilterSponsor !== "Non-Sponsored" &&
                                            <div className="bg-[#1f783b] py-[8px] px-[20px] text-[#dce4df] text-[11px] rounded-lg w-[200px]">
                                                <p className="font-[200]">Sponsor: <span className="font-[800]">{toFilterSponsor}</span></p>
                                                <p className="font-[200]">Password: <span className="font-[800]">{sponsorPass}</span></p>
                                            </div>
                                        }
                                    </div>
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
                    onApprove={(data) => onApprove(
                        {
                            data: data,
                            selectedCol: selectedCol,
                            closeModal: () => closeModal("approve", data)
                        }
                    )}
                    onReject={(data) => onReject(
                        {
                            data: data,
                            selectedCol: selectedCol,
                            closeModal: () => closeModal("cancel", data)
                        }
                    )}
                    onDelete={(data) => onDelete(
                        {
                            data: data,
                            selectedCol: selectedCol,
                            closeModal: () => closeModal("delete", data)
                        }
                    )}
                    handleTime={(e) => handleTime(e)}
                />
            </div>
        </div>
    )
}

export default MainTable;