import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { getItems, deleteWithCharaters, getApproved, getPendings } from '../../supabase/supabaseService';
import { supabase } from "/supabaseClient";
import { Toaster } from 'react-hot-toast';
import PhilsanLogo from "../../assets/philsan_logo.png"
import Widget from "./Widget";
import SliderModal from "./SliderModal";
import toast from 'react-hot-toast'

const MainTable = () => {
    const [allParticipants, setAllparticipants] = useState([])
	const [participants, setParticipants] = useState([]);
    const [selectedCol, setSelectedCol] = useState(null);
    const [proof, setProof] = useState(null)
    const [userStatus, setUserStatus] = useState("Approved");
    const [pendings, setPendings] = useState([]);
    const [approved, setApproved] = useState([]);
    const [canceled, setCanceled] = useState([])
    const bucket = 'philsan-proof-of-payments';

    useEffect(() => { 
        // getItems().then(setParticipants).catch(console.error)
		// getItems().then(setAllparticipants).catch(console.error)
        getApproved().then(setApproved).catch(console.error)
        getPendings().then(setPendings).catch(console.error)
		//for realtime update
        
		const channel = supabase
			.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'philsan_registration_2025' },
				(payload) => {
                    console.log("payload", payload)
					setParticipants((prevData) => [payload.new, ...prevData]);
					setAllparticipants((prevData) => [payload.new, ...prevData]);
				}
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'philsan_registration_2025' },
				(payload) => {
                     console.log("payload", payload)
				  setParticipants((prev) =>
					prev.map((item) =>
					  item.id === payload.new.id ? payload.new : item
					)
				  );

				  setAllparticipants((prev) =>
					prev.map((item) =>
					  item.id === payload.new.id ? payload.new : item
					)
				  );
				}
			  )
			.subscribe();

			// Cleanup on unmount
			return () => {
				supabase.removeChannel(channel);
			};

	}, []);	

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

    const closeModal = () => {
        setSelectedCol(null)
        setProof(null)
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
                                        setUserStatus={() => setUserStatus("Approved")}
                                    />
                                    <Widget
                                        title={"Pending"}
                                        value={pendings}
                                        color={"text-[#fb6c6c]"}
                                        userStatus={userStatus}
                                        setUserStatus={() => setUserStatus("Pending")}
                                    />
                                    <Widget
                                        title={"Canceled"}
                                        value={canceled}
                                        color={"text-[#bfcec4]"}
                                        userStatus={userStatus}
                                        setUserStatus={() => setUserStatus("Canceled")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className={`relative w-[100%] h-[100vh] overflow-y-scroll bg-[#dce4df] scrollbar-none p-[40px]`}>
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
							columns({
								// columnId: columnId,
								// setColumnId: (e) => handleColumnAction(e)
							})
						}
						data={userStatus === "Approved" ? approved : userStatus === "Pending" ? pendings : userStatus === "Canceled" && []}
						striped 
						theme={"philsan"}
						pagination
						onRowClicked={row => setSelectedCol(row)}
  						// conditionalRowStyles={conditionalRowStyles}
					/>
				</div>
                <SliderModal
                    selectedCol={selectedCol}
                    closeModal={() => closeModal()}
                    proof={proof}
                />
            </div>
        </div>
    )
}

export default MainTable;