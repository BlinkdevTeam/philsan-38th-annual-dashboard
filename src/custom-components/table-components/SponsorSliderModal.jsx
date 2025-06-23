import React, {useState, useEffect} from "react";

const SponsorSliderModal = (props) => {
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
        "reg_request"   
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
        reg_request: "Request Date"
    };

    const [userDetails, setUserDetails] = useState({});

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

    const reg_status = props.selectedCol ? props.selectedCol.reg_status : null;

    return (
        <>
            <div className={`overflow-y-scroll ${ props.selectedCol ? "w-[40%]" : "w-[0px]"} bg-[#dce4df] h-[100%] absolute bottom-0 right-[0px] transition-all duration-200 ease z-[2] scrollbar-none `}>
                <div className="h-[100%]">
                    <div className="py-[40px] px-[50px]">
                        <div className="flex justify-between gap-[50px] mb-[20px]">
                            <div className="cursor-pointer flex gap-[20px] items-center" onClick={props.closeModal}>
                                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14.9998 7H1.99985M6.99985 1L1.70696 6.29289C1.31643 6.68342 1.31643 7.31658 1.70696 7.70711L6.99985 13" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <h6 className="text-[#67706a] text-[24px]">Participant Details</h6>
                            </div>
                            <div className="flex gap-[20px]">
                                <div onClick={() => props.onApprove(userDetails)} className="flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] bg-[#acc5b4] hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out">
                                    <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M17 1L6.70711 11.2929C6.31658 11.6834 5.68342 11.6834 5.29289 11.2929L1 7" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    <p className="text-[#f9f9f9]">Save</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-[50px]">
                            {/* <div className="w-[40%]">
                                <div className="pb-[10px]">
                                    <h6 className="text-[#67706a] text-[12px]">Proof of Payment</h6>
                                </div>
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
                            </div> */}
                            <div className="w-[100%]">
                                <div className="flex flex-col gap-[10px] text-[18px]">
                                    {userDetails.email &&
                                        fieldKeys.map((key) => {
                                            const condition = key === "email" || key === "sponsor" || key === "reg_request";
                                            return (
                                                <div key={key} className="flex flex-col gap-[2px]">
                                                    <p className="text-[#67706a] text-[12px]">{userDetails?.fileNames?.[key]}:</p>
                                                    <input 
                                                        className={`font-[400] rounded-lg p-[10px] ${condition ? "bg-[#ede9dc] text-[#93896c]" : "bg-[#acc5b4] text-[#000000]"} text-[14px]`} 
                                                        name={key} 
                                                        value={userDetails[key]}
                                                        onChange={(e) =>
                                                            setUserDetails((prev) => ({
                                                            ...prev,
                                                            [key]: e.target.value,
                                                            }))
                                                        }
                                                    readOnly={
                                                        reg_status === condition
                                                    }
                                                    />
                                                </div>
                                            )
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
                    fixed inset-0 bg-black z-[1] transition-opacity duration-300 ease-in-out
                    ${props.selectedCol ? 'opacity-50 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
                >
            </div>
        </>
    )
}

export default SponsorSliderModal;