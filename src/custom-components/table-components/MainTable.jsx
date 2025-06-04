import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { getItems, deleteWithCharaters, getApproved, getPendings, getCanceled, getVerified, getSponsorsApproved, getSponsorsPendings, updateItem } from '../../supabase/supabaseService';
import { supabase } from "/supabaseClient";
import { Toaster } from 'react-hot-toast';
import PhilsanLogo from "../../assets/philsan_logo.png"
import Widget from "./Widget";
import SliderModal from "./SliderModal";
import toast from 'react-hot-toast'

const MainTable = ({sponsor}) => {
    const bucket = 'philsan-proof-of-payments';
    const [allParticipants, setAllparticipants] = useState([]);
	const [participants, setParticipants] = useState([]);
    const [selectedCol, setSelectedCol] = useState(null);
    const [proof, setProof] = useState(null);
    const [userStatus, setUserStatus] = useState("Approved");
    const [pendings, setPendings] = useState([]);
    const [approved, setApproved] = useState([]);
    const [verified, setVerified] = useState([]);
    const [canceled, setCanceled] = useState([]);

    useEffect(() => {
        if (!sponsor) return;

        const fetchData = () => {
            try {
            if (sponsor.name === "Philsan Secretariat") {
                getApproved().then(setApproved);
                getPendings().then(setPendings);
                getCanceled().then(setCanceled);
                getVerified().then(setVerified);
            } else {
                // setApproved(getSponsorsApproved({ sponsor: sponsor.name }));
                // setPendings(getSponsorsPendings({ sponsor: sponsor.name }));
            }
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
                const isRelevant =
                sponsor.name === "Philsan Secretariat" ||
                newData.sponsor === sponsor.name;

                if (!isRelevant) return;

                updateByStatus(newData);
            }
            )
            .subscribe();

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
            case "verified":
                updateState(setVerified);
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
    }, [sponsor]);



    useEffect(() => {
        if (selectedCol) {
            const filePath = `${selectedCol.payment}`; // assuming this is your full path
            const { data, error } = supabase
                .storage
                .from(bucket)
                .getPublicUrl(filePath);

            if (error) {
                console.error('Error fetching public URL:', error);
            } else {
                setProof(data.publicUrl);
            }
        }
    }, [selectedCol]);

    const onApprove = () => {
        // console.log(selectedCol)
        updateItem(selectedCol.email, {reg_status: "approved"}, )
        closeModal()
    }

    const onReject = () => {
        // console.log(selectedCol)
        updateItem(selectedCol.email, {reg_status: "canceled"}, )
        closeModal()
    }

    const closeModal = () => {
        setSelectedCol(null)
        setProof(null)
    }

    const setContent = (status) => {
        setUserStatus(status)
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
                                <div className="flex flex-col">
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
                                        color={"text-[#bfcec4]"}
                                        userStatus={userStatus}
                                        setUserStatus={() => setContent("Canceled")}
                                    />
                                    <Widget
                                        title={"Verified"}
                                        value={verified}
                                        color={"text-[#bfcec4]"}
                                        userStatus={userStatus}
                                        setUserStatus={() => setContent("Verified")}
                                    />
                                    <button onClick={() => setContent("registration")} className="cursor-pointer py-[10px] bg-[#ffe7a4] mx-[20px] mt-[20px] rounded-lg">Invite Participant</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className={`relative w-[100%] h-[100vh] overflow-y-scroll bg-[#dce4df] scrollbar-none p-[40px]`}>
					{ userStatus === "registration" ? 
                        <div className="w-[100%]">
                            <div className="max-w-[1200]">
                                <div className="flex">
                                    <div className=" w-[100%] flex justify-center items-start h-[100vh]">
                                        <div className="flex flex-col gap-[20px]">
                                            <div className="flex flex-col justify-start items-center pb-[10px]">
                                                <div className="w-[]">
                                                    <img className="w-[90px]" src={PhilsanLogo} alt="" />
                                                </div>
                                                {/* <p className="text-[#1f783b] text-[12px] font-[800]">Philippine Society of Animal Nutritionists’</p> */}
                                                <h6 className="text-[#1f783b] text-[26px] font-[1000] mt-[-5px]">38th CONVENTION</h6>
                                            </div>
                                            <div className="bg-[#ffffff] px-[30px] pb-[60px] pt-[40px] rounded-lg shadow-md">
                                                <div className="flex flex-col gap-[10px]">
                                                    <div className="flex flex-col gap-[5px] w-[350px]">
                                                        <h6 className="font-[700] text-[#1f783b]">Enter Email Adress</h6>
                                                        <input className="bg-[#eaeeeb] p-[10px] rounded-md" type="text" placeholder="Email" />
                                                    </div>
                                                    <button className="w-[100%] bg-[#F9B700] hover:bg-[#ffe700] py-[10px] text-[#ffffff] rounded-lg transition-background-color duration-300 ease-in-out">Invite</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> :
                        <div>
                            <div className="flex gap-[20px] mb-[20px]">
                                <input 
                                    className={`bg-[#bfcec4] w-[100%] py-[10px] pr-[10px] pl-[20px] text-[#000000]`} type="text" placeholder="Enter Keyword" 
                                    // value={searchTerm}
                                    // onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <DataTable
                                highlightOnHover
                                columns={
                                    columns()
                                }
                                data={
                                    userStatus === "Approved" ? approved : 
                                    userStatus === "Pending" ? pendings :
                                    userStatus === "Verified" ? verified : 
                                    userStatus === "Canceled" && canceled
                                }
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
                    selectedCol={selectedCol}
                    closeModal={() => closeModal()}
                    proof={proof}
                    onApprove={() => onApprove()}
                    onReject={() => onReject()}
                />
            </div>
        </div>
    )
}

export default MainTable;