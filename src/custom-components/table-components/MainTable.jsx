import { useEffect, useState } from "react"
import DataTable from 'react-data-table-component';
import { columns } from './columns';
import { getItems, deleteWithCharaters } from '../../supabase/supabaseService';
import { supabase } from "/supabaseClient";
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast'

const MainTable = () => {
    const [allParticipants, setAllparticipants] = useState([])
	const [participants, setParticipants] = useState([]);


    useEffect(() => {
        getItems().then(setParticipants).catch(console.error)
		getItems().then(setAllparticipants).catch(console.error)
		//for realtime update
        
		const channel = supabase
			.channel('custom-all-channel')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'medical_professionals' },
				(payload) => {
                    console.log("payload", payload)
					setParticipants((prevData) => [payload.new, ...prevData]);
					setAllparticipants((prevData) => [payload.new, ...prevData]);
				}
			)
			.on(
				'postgres_changes',
				{ event: 'UPDATE', schema: 'public', table: 'medical_professionals' },
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

    return (
        <div>
            <Toaster position="top-left" reverseOrder={false} />
            <div className="flex">
                <div className="sidebar flex flex-col justify-between w-[400px] overflow-y-scroll scrollbar-none">
                    <div className="bg-[#dce4df] pl-[50px] py-[50px]">
                        
                    </div>
                    <div className={`bg-[#1f783b]`}>
                        <div className={`h-[100vh] pl-[20px] pb-[40px]`}>
                            {/* <div className="flex justify-end w-[100%]">
                                <svg width="20" height="20" viewBox="0 0 156 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M156.001 -0.00012207L156.001 156L0.000969744 156C0.000969744 156 57.9839 156 106.992 106.991C156.001 57.9826 156.001 -0.00012207 156.001 -0.00012207Z" fill="#dce4df"/>
                                </svg>
                            </div> */}
                            <div className="flex justify-end w-[100%]">
                                <svg width="40" height="40" viewBox="0 0 156 156" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.000976562 -0.00012207L156.001 -0.00012207V156C156.001 156 156.001 98.0169 106.992 49.0085C57.9837 4.95911e-05 0.000976562 -0.00012207 0.000976562 -0.00012207Z" fill="#dce4df"/>
                                </svg>
                            </div>
                            <div className="pr-[20px]">
                                <div className="">
                                    <div className="relative cursor-pointer">
                                        <div className="absolute right-[8px] top-[8px] w-[30px] h-[30px] bg-[#f9b700] text-[#ffffff] flex justify-center items-center rounded-full">1</div>
                                        <div className="flex gap-[10px] items-center w-[100%] py-[10px] px-[20px] rounded-full">
                                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5H2C1.44772 5 1 5.44772 1 6C1 6.55228 1.44772 7 2 7H3M3 13H2C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15H3M17 16.124C15.6353 13.6646 13.012 12 10 12C6.98797 12 4.36473 13.6646 3 16.124M6.2 19H13.8C14.9201 19 15.4802 19 15.908 18.782C16.2843 18.5903 16.5903 18.2843 16.782 17.908C17 17.4802 17 16.9201 17 15.8V4.2C17 3.0799 17 2.51984 16.782 2.09202C16.5903 1.71569 16.2843 1.40973 15.908 1.21799C15.4802 1 14.9201 1 13.8 1H6.2C5.07989 1 4.51984 1 4.09202 1.21799C3.71569 1.40973 3.40973 1.71569 3.21799 2.09202C3 2.51984 3 3.07989 3 4.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19ZM13.0376 8.03768C13.0376 9.71534 11.6776 11.0754 9.99989 11.0754C8.32223 11.0754 6.96222 9.71534 6.96222 8.03768C6.96222 6.36001 8.32223 5 9.99989 5C11.6776 5 13.0376 6.36001 13.0376 8.03768Z" stroke="#ffffff" stroke-width="1"/>
                                            </svg>
                                            <p className="text-[#ffffff]">Total Registered</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="relative cursor-pointer">
                                        <div className="absolute right-[8px] top-[8px] w-[30px] h-[30px] bg-[#f9b700] text-[#ffffff] flex justify-center items-center rounded-full">1</div>
                                        <div className="flex gap-[10px] items-center w-[100%] py-[10px] px-[20px] rounded-full">
                                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5H2C1.44772 5 1 5.44772 1 6C1 6.55228 1.44772 7 2 7H3M3 13H2C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15H3M17 16.124C15.6353 13.6646 13.012 12 10 12C6.98797 12 4.36473 13.6646 3 16.124M6.2 19H13.8C14.9201 19 15.4802 19 15.908 18.782C16.2843 18.5903 16.5903 18.2843 16.782 17.908C17 17.4802 17 16.9201 17 15.8V4.2C17 3.0799 17 2.51984 16.782 2.09202C16.5903 1.71569 16.2843 1.40973 15.908 1.21799C15.4802 1 14.9201 1 13.8 1H6.2C5.07989 1 4.51984 1 4.09202 1.21799C3.71569 1.40973 3.40973 1.71569 3.21799 2.09202C3 2.51984 3 3.07989 3 4.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19ZM13.0376 8.03768C13.0376 9.71534 11.6776 11.0754 9.99989 11.0754C8.32223 11.0754 6.96222 9.71534 6.96222 8.03768C6.96222 6.36001 8.32223 5 9.99989 5C11.6776 5 13.0376 6.36001 13.0376 8.03768Z" stroke="#ffffff" stroke-width="1"/>
                                            </svg>
                                            <p className="text-[#ffffff]">Total Time In</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="">
                                    <div className="relative cursor-pointer">
                                        <div className="absolute right-[8px] top-[8px] w-[30px] h-[30px] bg-[#f9b700] text-[#ffffff] flex justify-center items-center rounded-full">1</div>
                                        <div className="flex gap-[10px] items-center w-[100%] py-[10px] px-[20px] rounded-full">
                                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 5H2C1.44772 5 1 5.44772 1 6C1 6.55228 1.44772 7 2 7H3M3 13H2C1.44772 13 1 13.4477 1 14C1 14.5523 1.44772 15 2 15H3M17 16.124C15.6353 13.6646 13.012 12 10 12C6.98797 12 4.36473 13.6646 3 16.124M6.2 19H13.8C14.9201 19 15.4802 19 15.908 18.782C16.2843 18.5903 16.5903 18.2843 16.782 17.908C17 17.4802 17 16.9201 17 15.8V4.2C17 3.0799 17 2.51984 16.782 2.09202C16.5903 1.71569 16.2843 1.40973 15.908 1.21799C15.4802 1 14.9201 1 13.8 1H6.2C5.07989 1 4.51984 1 4.09202 1.21799C3.71569 1.40973 3.40973 1.71569 3.21799 2.09202C3 2.51984 3 3.07989 3 4.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19ZM13.0376 8.03768C13.0376 9.71534 11.6776 11.0754 9.99989 11.0754C8.32223 11.0754 6.96222 9.71534 6.96222 8.03768C6.96222 6.36001 8.32223 5 9.99989 5C11.6776 5 13.0376 6.36001 13.0376 8.03768Z" stroke="#ffffff" stroke-width="1"/>
                                            </svg>
                                            <p className="text-[#ffffff]">Total Time Out</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className={`w-[100%] pt-[40px] pl-[50px] pr-[20px] h-[100vh] overflow-y-scroll bg-[#dce4df]`}>
					<div className="flex gap-[20px] mb-[20px]">
						<input 
                            className={`bg-[#bfcec4] w-[100%] py-[10px] pr-[10px] pl-[20px] text-[#000000] rounded-full`} type="text" placeholder="Enter Keyword" 
							// value={searchTerm}
        					// onChange={(e) => setSearchTerm(e.target.value)}
						/>
                        <div className="relative inline-flex cursor-pointer">
                            <div className="absolute -top-3 -right-2 w-[30px] h-[30px] bg-red-600 text-white text-xs flex justify-center items-center rounded-full">1</div>
                            <div className="flex items-center gap-2 bg-[#1f783b] text-white py-2 px-4 rounded-full">
                                <svg className="w-5 h-5" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7 18.6458C7.73295 19.4762 8.80531 20 10 20C11.1947 20 12.2671 19.4762 13 18.6458M14 1C16.387 2.18623 18.1726 4.40103 18.777 7.06448M5.77698 1C3.39 2.18623 1.60437 4.40103 1 7.06448M15.9974 12.1809V9.00009C15.9974 5.67781 13.3223 3.00009 10 3.00009C6.67772 3.00009 3.96637 5.56365 3.96637 9.00009V12.1594C3.96637 12.6425 3.89106 13.1225 3.74335 13.5809L3.00488 15.8724C2.98466 15.9352 3.02982 16 3.09376 16H16.8632C16.9308 16 16.9788 15.9341 16.958 15.8697L16.2146 13.5627C16.0707 13.1162 15.9974 12.65 15.9974 12.1809Z"
                                    stroke="white" strokeWidth="1" strokeLinecap="round" />
                                </svg>
                                <span className="whitespace-nowrap">Registration Requests</span>
                            </div>
                        </div>
					</div>
					<DataTable
						highlightOnHover
						columns={
							columns({
								// columnId: columnId,
								// setColumnId: (e) => handleColumnAction(e)
							})
						}
						// data={participants}
						striped //how to customized this
						// theme={colorTheme ? "boehringer" : null}
						pagination
						// onRowClicked={row => setColumnId(row.id)}
  						// conditionalRowStyles={conditionalRowStyles}
					/>
				</div>
            </div>
        </div>
    )
}

export default MainTable;