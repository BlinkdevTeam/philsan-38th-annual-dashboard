import React, {useState, useEffect, useRef} from "react";
import { createDeletedItem, getSponsorList } from "../../supabase/supabaseService";

const SliderModal = (props) => {
    const [zoom, setZoom] = useState(false);
    const fieldKeys = [
        "email",
        "first_name",
        "middle_name",
        "last_name",
        "mobile",
        "company",
        "membership",
        "agri_license",
        "sponsor",
        "reg_request", 
        "remarks"
    ];

    const fieldLabels = {
        email: "Email",
        first_name: "First Name",
        middle_name: "Middle Name",
        last_name: "Last Name",
        mobile: "Mobile",
        company: "Company",
        membership: "Membership",
        agri_license: "Agri License",
        sponsor: "Sponsor",
        reg_request: "Request Date", 
        remarks: "Remarks"
    };

    const [userDetails, setUserDetails] = useState({});
    const [isCancelRemarksOpen, setIsCancelremarksOpen] = useState(false);
    const [isDeleteRamarksOpen, setIsDeleteRemarksOpen] = useState(false);
    const [sponsorList, setSponsorList] = useState([])
    
    const cancelRef = useRef(null);
    const deleteRef = useRef(null);

    useEffect(() => {
        getSponsorList().then(setSponsorList);
    }, [])

    useEffect(() => {
        const col = props.selectedCol || {};

        const initialState = fieldKeys.reduce((acc, key) => {
            acc[key] = col[key] || "";
            return acc;
        }, {});

        setUserDetails({
            ...initialState,
            errors: {},
            fileNames: fieldLabels
        });
    }, [props.selectedCol])

    //handling outside click to close popup
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            isCancelRemarksOpen &&
            cancelRef.current &&
            !cancelRef.current.contains(event.target)
        ) {
            setIsCancelremarksOpen(false);
        }

        if (
            isDeleteRamarksOpen &&
            deleteRef.current &&
            !deleteRef.current.contains(event.target)
        ) {
            setIsDeleteRemarksOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isCancelRemarksOpen, isDeleteRamarksOpen]);

    const reg_status = props.selectedCol ? props.selectedCol.reg_status : null;



    const handleCancelation = () => {
        const errors = {};

        // Only check the "remarks" field
        ["remarks"].forEach(item => {
            if (userDetails[item] === "" || userDetails[item] === null) {
                errors[item] = "This field is empty";
            } else {
                errors[item] = "";
            }
        });

        // Count how many real (non-empty) errors exist
        const hasErrors = Object.values(errors).some(error => error !== "");

        // Always update errors in state
        setUserDetails(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                ...errors
            },
            fileNames: fieldLabels
        }));

        // Do something depending on whether there are errors
        if (hasErrors) {
            console.log("There are errors. Please fix them.");
            setIsCancelremarksOpen(false)
            setIsDeleteRemarksOpen(false)
            // e.g. show a message, prevent submission, etc.
        } else {
            console.log("No errors. Proceeding with cancellation.");
            props.onReject(userDetails)
            setIsCancelremarksOpen(false)
            setIsDeleteRemarksOpen(false)
        }
    };


    const handleApprove = () => {
        const errors = {};

        // Validate all fields except "remarks"
        Object.keys(userDetails).forEach(item => {
            if (item !== "remarks") {
                if (userDetails[item] === "" || userDetails[item] === null) {
                    errors[item] = "This field is empty";
                } else {
                    errors[item] = "";
                }
            }
        });

        // Check if any actual errors exist (non-empty error messages)
        const hasErrors = Object.values(errors).some(error => error !== "");

        // Always update errors in state
        setUserDetails(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                ...errors
            },
            fileNames: fieldLabels
        }));

        // Conditional logic based on presence of errors
        if (hasErrors) {
            console.log("There are errors. Please fix them.");
            setIsCancelremarksOpen(false)
            setIsDeleteRemarksOpen(false)
            // Do something if there are errors
        } else {
            console.log("No errors. Proceeding.");
            // Do something else if no errors
            // props.onApprove?.(); // optional chaining if it's a callback
            props.onApprove(userDetails)
            setIsCancelremarksOpen(false)
            setIsDeleteRemarksOpen(false)
        }
    };

    const handleDeletion = () => {
        
        const errors = {};

        // Only check the "remarks" field
        ["remarks"].forEach(item => {
            if (userDetails[item] === "" || userDetails[item] === null) {
                errors[item] = "This field is empty";
            } else {
                errors[item] = "";
            }
        });

        // Count how many real (non-empty) errors exist
        const hasErrors = Object.values(errors).some(error => error !== "");

        // Always update errors in state
        setUserDetails(prev => ({
            ...prev,
            errors: {
                ...prev.errors,
                ...errors
            },
            fileNames: fieldLabels
        }));

        // Do something depending on whether there are errors
        if (hasErrors) {
            console.log("There are errors. Please fix them.");
            // e.g. show a message, prevent submission, etc.
        } else {
            console.log("No errors. Proceeding with cancellation.");
            const data = {
                ...props.selectedCol,
                remarks: userDetails.remarks // this will overwrite the existing remarks field
            };

            if (userDetails.remarks) {
                console.log('data', data)
                createDeletedItem(data).then(res => {
                    if (res.length > 0) {
                        props.onDelete();
                        setIsCancelremarksOpen(false)
                        setIsDeleteRemarksOpen(false)
                    }
                });
            } else {
                setIsCancelremarksOpen(false)
                setIsDeleteRemarksOpen(false)
            }
        }

    };

    const handlePopup = (trigger) => {
        console.log("trigger", trigger)
        if(trigger === "cancel") {
            setIsCancelremarksOpen(!isCancelRemarksOpen)
            setIsDeleteRemarksOpen(false)
        }

        if(trigger === "delete") {
            setIsCancelremarksOpen(false)
            setIsDeleteRemarksOpen(!isDeleteRamarksOpen)
        }
    }

    return (
        <>
            <div className={`overflow-y-scroll ${ props.selectedCol ? "w-[60%]" : "w-[0px]"} bg-[#dce4df] absolute top-[0px] right-[0px] transition-all duration-200 ease z-[99] scrollbar-none `}>
                <div className="h-[100vh]">
                    <div className="py-[40px] px-[50px]">
                        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-[50px]">
                            <div className="cursor-pointer flex gap-[20px] items-center" onClick={props.closeModal}>
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.9998 7H1.99985M6.99985 1L1.70696 6.29289C1.31643 6.68342 1.31643 7.31658 1.70696 7.70711L6.99985 13" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <h6 className="text-[#67706a] text-[18px]">Participant Details</h6>
                            </div>
                            <div className="flex gap-[20px]">
                                {/* timein and accept */}
                                <div className="flex gap-[20px] w-fit">
                                    <div className="flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] bg-[#acc5b4] hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out w-fit">
                                        <svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <g id="Layer_15" data-name="Layer 15" fill="#ffffff">
                                                <path d="m12 20a8 8 0 1 1 8-8 1 1 0 0 0 2 0 10 10 0 1 0 -10 10 1 1 0 0 0 0-2z"/>
                                                <path d="m12 6a1 1 0 0 0 -1 1v4.59l-2.71 2.7a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l3-3a1 1 0 0 0 .29-.71v-5a1 1 0 0 0 -1-1z"/>
                                                <path d="m21 16h-3.59l.3-.29a1 1 0 0 0 -1.42-1.42l-2 2a1 1 0 0 0 -.21.33 1 1 0 0 0 0 .76 1 1 0 0 0 .21.33l2 2a1 1 0 0 0 1.42 0 1 1 0 0 0 0-1.42l-.3-.29h3.59a1 1 0 0 0 0-2z"/>
                                            </g>
                                        </svg>
                                        <p className="text-[#f9f9f9]">Time-in</p>
                                    </div>
                                    <div onClick={handleApprove} className="flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] bg-[#acc5b4] hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out">
                                        <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17 1L6.70711 11.2929C6.31658 11.6834 5.68342 11.6834 5.29289 11.2929L1 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <p className="text-[#f9f9f9]">Accept</p>
                                    </div>
                                </div>
                                {/* delete and cancel */}
                                <div className="relative">
                                    <div onClick={() => handlePopup("cancel")} className={`flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] ${isCancelRemarksOpen ? "bg-[#797979]" : "bg-[#acc5b4] hover:bg-[#424242]"} cursor-pointer transition-background-color duration-300 ease-in-out`}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13 1L1 13M13 13L1 1.00001" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                        <p className="text-[#f9f9f9]">Cancel</p>
                                    </div>
                                    {userDetails.email && isCancelRemarksOpen &&
                                        fieldKeys.map((key) => {

                                            if(key === "remarks") {
                                                return (
                                                    <div ref={cancelRef} key={key} className="absolute min-w-[250px] z-[1] top-[40px] flex flex-col gap-[0px] w-max bg-[#ffffff] p-[10px] rounded-3xl rounded-tl-[0px]">
                                                        <p className="text-[#67706a] text-[12px] w-max">{userDetails?.fileNames?.[key]}:</p>
                                                        <textarea 
                                                            className={`font-[400] rounded-lg p-[10px] text-[#000000] text-[12px] ${userDetails["errors"][key] ? "border-[2px] border-[red]" : "border-[1px] border-[green]"}`} 
                                                            name={key} 
                                                            value={userDetails[key] ?? ""}
                                                            onChange={(e) =>
                                                                setUserDetails((prev) => ({
                                                                ...prev,
                                                                [key]: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                        <p onClick={handleCancelation} className="cursor-pointer text-[14px] p-[10px] w-[100%] bg-[#797979] hover:bg-[#424242] mt-[5px] rounded-lg text-[#ffffff] font-[200]">Cancel Registration</p>
                                                    </div>
                                                )
                                            }
                                    })}
                                </div>
                                <div className="relative">
                                    <div onClick={() => handlePopup("delete")} className={`flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] ${isDeleteRamarksOpen ? "bg-[#ba4b4b]" : "bg-[#acc5b4] hover:bg-[#ba4b4b]"} cursor-pointer transition-background-color duration-300 ease-in-out`}>
                                        <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 8C7 7.44772 6.55228 7 6 7C5.44772 7 5 7.44772 5 8H7ZM5 16C5 16.5523 5.44772 17 6 17C6.55228 17 7 16.5523 7 16H5ZM11 8C11 7.44772 10.5523 7 10 7C9.44771 7 9 7.44772 9 8H11ZM9 16C9 16.5523 9.44771 17 10 17C10.5523 17 11 16.5523 11 16H9ZM3.09202 18.782L3.54601 17.891H3.54601L3.09202 18.782ZM2.21799 17.908L3.10899 17.454L3.10899 17.454L2.21799 17.908ZM13.782 17.908L12.891 17.454V17.454L13.782 17.908ZM12.908 18.782L12.454 17.891H12.454L12.908 18.782ZM1 4C0.447715 4 0 4.44771 0 5C0 5.55228 0.447715 6 1 6V4ZM15 6C15.5523 6 16 5.55228 16 5C16 4.44771 15.5523 4 15 4V6ZM3.5 5C3.5 5.55228 3.94772 6 4.5 6C5.05228 6 5.5 5.55228 5.5 5H3.5ZM10.5 5C10.5 5.55228 10.9477 6 11.5 6C12.0523 6 12.5 5.55228 12.5 5H10.5ZM5 8V16H7V8H5ZM9 8V16H11V8H9ZM13 5V15.8H15V5H13ZM10.8 18H5.2V20H10.8V18ZM1 5V15.8H3V5H1ZM5.2 18C4.62345 18 4.25117 17.9992 3.96784 17.9761C3.69617 17.9539 3.59545 17.9162 3.54601 17.891L2.63803 19.673C3.01641 19.8658 3.40963 19.9371 3.80497 19.9694C4.18864 20.0008 4.65645 20 5.2 20V18ZM1 15.8C1 16.3436 0.999222 16.8114 1.03057 17.195C1.06287 17.5904 1.13419 17.9836 1.32698 18.362L3.10899 17.454C3.0838 17.4045 3.04612 17.3038 3.02393 17.0322C3.00078 16.7488 3 16.3766 3 15.8H1ZM3.54601 17.891C3.35785 17.7951 3.20487 17.6422 3.10899 17.454L1.32698 18.362C1.6146 18.9265 2.07354 19.3854 2.63803 19.673L3.54601 17.891ZM13 15.8C13 16.3766 12.9992 16.7488 12.9761 17.0322C12.9539 17.3038 12.9162 17.4045 12.891 17.454L14.673 18.362C14.8658 17.9836 14.9371 17.5904 14.9694 17.195C15.0008 16.8114 15 16.3436 15 15.8H13ZM10.8 20C11.3436 20 11.8114 20.0008 12.195 19.9694C12.5904 19.9371 12.9836 19.8658 13.362 19.673L12.454 17.891C12.4045 17.9162 12.3038 17.9539 12.0322 17.9761C11.7488 17.9992 11.3766 18 10.8 18V20ZM12.891 17.454C12.7951 17.6422 12.6422 17.7951 12.454 17.891L13.362 19.673C13.9265 19.3854 14.3854 18.9265 14.673 18.362L12.891 17.454ZM1 6H2V4H1V6ZM2 6H14V4H2V6ZM14 6H15V4H14V6ZM5.5 4.2C5.5 3.06743 6.53305 2 8 2V0C5.60095 0 3.5 1.79795 3.5 4.2H5.5ZM8 2C9.46695 2 10.5 3.06743 10.5 4.2H12.5C12.5 1.79795 10.399 0 8 0V2ZM3.5 4.2V5H5.5V4.2H3.5ZM10.5 4.2V5H12.5V4.2H10.5Z" fill="#ffffff"/>
                                        </svg>
                                        <p className="text-[#f9f9f9]">Delete</p>
                                    </div>
                                    {userDetails.email && isDeleteRamarksOpen&&
                                        fieldKeys.map((key) => {

                                            if(key === "remarks") {
                                                return (
                                                    <div ref={deleteRef} key={key} className="absolute min-w-[250px] z-[1] top-[40px] right-[0px] flex flex-col gap-[0px] w-max bg-[#ffffff] p-[10px] rounded-3xl rounded-tr-[0px]">
                                                        <p className="text-[#67706a] text-[12px] w-max">{userDetails?.fileNames?.[key]}:</p>
                                                        <textarea 
                                                            className={`font-[400] rounded-lg p-[10px] text-[#000000] text-[12px] ${userDetails["errors"][key] ? "border-[2px] border-[red]" : "border-[1px] border-[green]"}`} 
                                                            name={key} 
                                                            value={userDetails[key] ?? ""}
                                                            onChange={(e) =>
                                                                setUserDetails((prev) => ({
                                                                ...prev,
                                                                [key]: e.target.value,
                                                                }))
                                                            }
                                                        />
                                                        <p onClick={handleDeletion} className="cursor-pointer text-[14px] p-[10px] w-[100%] bg-[#ba4b4b] hover:bg-[red] mt-[5px] rounded-lg text-[#ffffff] font-[200]">Delete Registration</p>
                                                    </div>
                                                )
                                            }
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-[50px]">
                            <div className="w-[40%]">
                                <div className="pb-[10px]">
                                    <h6 className="text-[#67706a] text-[12px]">Proof of Payment</h6>
                                </div>
                                {/* PROOF OF PAYMENT */}
                                <div className="relative flex flex-col gap-[10px] justify-center items-center p-[20px] bg-[#acc5b4] rounded-lg">
                                    {props.proof ? <img src={props.proof} alt="" /> : <p>This person is sponsored</p>}
                                    {
                                        props.proof ?
                                        <div onClick={() => setZoom(true)} className="cursor-pointer justify-center text-center p-[10px] bg-[#ffffff] hover:bg-[#f9f9f9] shadow bottom-[20px] right-[20px] w-[100%]">
                                            <p className="text-[14px]">Full View</p>
                                        </div> : <></>
                                    }
                                </div>
                                {
                                    props.proof ?
                                    <div className="group">
                                        <div className="py-[10px] w-[100%] bg-[#acc5b4] group-hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out rounded-lg flex justify-center items-center mt-[10px]">
                                            <p className="text-[#67706a] text-[14px] underlined group-hover:text-[#ffffff]">Download</p>
                                        </div>
                                    </div> : <></>
                                }
                            </div>
                            <div className="w-[60%]">
                                <div className="flex flex-col gap-[10px] text-[18px]">
                                    {userDetails.email &&
                                        fieldKeys.map((key) => {
                                            const condition = key === "email" || key === "reg_request" || key === "remarks";
                                            
                                            if(key === "sponsor") {
                                                return (
                                                    <div key={key} className="flex flex-col gap-[2px]">
                                                        <p className="text-[#67706a] text-[12px]">{userDetails?.fileNames?.[key]}:</p>
                                                       <select
                                                            className={`font-[400] rounded-lg p-[10px] ${userDetails["errors"][key] && "border-[2px] border-[red]"} ${condition ? "bg-[#ede9dc] text-[#93896c]" : "bg-[#acc5b4] text-[#000000]"} text-[14px]`}
                                                            name="sponsor"
                                                            value={userDetails[key]}
                                                            onChange={(e) =>
                                                                setUserDetails((prev) => ({
                                                                ...prev,
                                                                [key]: e.target.value,
                                                                }))
                                                            }
                                                        >
                                                            <option value="">Select a sponsor</option>
                                                            <option value="Non-Sponsored">Non-Sponsored</option>
                                                            
                                                            {sponsorList.map((i, index) => (
                                                                <option key={"sponsor-name" + index} value={i.sponsor_name}>{i.sponsor_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div key={key} className="flex flex-col gap-[2px]">
                                                        <p className="text-[#67706a] text-[12px]">{userDetails?.fileNames?.[key]}:</p>
                                                        <input 
                                                            className={`font-[400] rounded-lg p-[10px] ${userDetails["errors"][key] && "border-[2px] border-[red]"} ${condition ? "bg-[#ede9dc] text-[#93896c]" : "bg-[#acc5b4] text-[#000000]"} text-[14px]`} 
                                                            name={key} 
                                                            value={userDetails[key]}
                                                            onChange={(e) =>
                                                                setUserDetails((prev) => ({
                                                                ...prev,
                                                                [key]: e.target.value,
                                                                }))
                                                            }
                                                        readOnly={condition}
                                                        />
                                                    </div>
                                                )
                                            }
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        <div className={`absolute top-0 left-0 w-full h-full flex justify-center items-center transition-all duration-300 ease-in-out ${zoom ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <div className="bg-black/85 w-full h-full absolute top-0 left-0 z-0"></div>

                            <div className="w-[70%] h-[70%] flex justify-center items-center shadow-lg z-10">
                                {props.proof ?
                                    <img src={props.proof} alt="" className="max-w-full max-h-full" /> :
                                props.sponsor &&
                                    <div>
                                        <p>This person is sponsored</p>
                                    </div>
                                }
                            </div>

                            <div onClick={() => setZoom(false)} className="absolute inset-0 z-20"></div>
                        </div>

                    }
                </div>
            </div>
            <div
                onClick={props.closeModal}
                className={`
                    fixed inset-0 bg-black z-[98] transition-opacity duration-300 ease-in-out
                    ${props.selectedCol ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                >
            </div>
        </>
    )
}

export default SliderModal;