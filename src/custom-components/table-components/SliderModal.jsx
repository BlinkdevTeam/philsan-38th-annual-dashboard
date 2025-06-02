

const SliderModal = (props) => {
    const email = props.selectedCol ? props.selectedCol.email : null
    const firstName = props.selectedCol ? props.selectedCol.first_name : null
    const lastName = props.selectedCol ? props.selectedCol.last_name : null
    const mobile = props.selectedCol ? props.selectedCol.mobile : null
    const company = props.selectedCol ? props.selectedCol.company : null
    const license = props.selectedCol ? props.selectedCol.agri_license : null
    const membership = props.selectedCol ? props.selectedCol.membership : null
    const regRequest = props.selectedCol ? props.selectedCol.reg_request : null

    return (
        <>
                    <div className={`overflow-y-scroll ${ props.selectedCol ? "w-[60%]" : "w-[0px]"} bg-[#dce4df] absolute top-[0px] right-[0px] transition-all duration-200 ease z-[2] scrollbar-none `}>
                        <div className="h-[100vh]">
                            <div className="py-[40px] px-[50px]">
                                <div className="flex justify-between items-center mb-[50px]">
                                    <div className="flex gap-[20px] items-center" onClick={props.closeModal}>
                                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.9998 7H1.99985M6.99985 1L1.70696 6.29289C1.31643 6.68342 1.31643 7.31658 1.70696 7.70711L6.99985 13" stroke="#111111" stroke-width="2" stroke-linecap="round"/>
                                        </svg>
                                        <h6 className="text-[#67706a] text-[24px]">Participant Details</h6>
                                    </div>
                                    <div className="flex gap-[20px]">
                                        <div className="flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] bg-[#acc5b4] hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out">
                                            <svg width="18" height="13" viewBox="0 0 18 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M17 1L6.70711 11.2929C6.31658 11.6834 5.68342 11.6834 5.29289 11.2929L1 7" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                                            </svg>
                                            <p className="text-[#f9f9f9]">Accept</p>
                                        </div>
                                        <div className="flex gap-[10px] items-center px-[20px] py-[10px] rounded-[8px] bg-[#acc5b4] hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13 1L1 13M13 13L1 1.00001" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
                                            </svg>
                                            <p className="text-[#f9f9f9]">Reject</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-[50px]">
                                    <div className="w-[40%]">
                                        <div className="pb-[10px]">
                                            <h6 className="text-[#67706a] text-[12px]">Proof of Payment</h6>
                                        </div>
                                        {/* PROOF OF PAYMENT */}
                                        <div className="relative flex flex-col gap-[10px] justify-center items-center p-[20px] bg-[#acc5b4] rounded-[20px]">
                                            <img src={props.proof} alt="" />
                                            <div className="justify-center text-center p-[10px] bg-[#ffffff] shadow bottom-[20px] right-[20px] w-[100%]">
                                                <p className="text-[14px]">Full View</p>
                                            </div>
                                        </div>
                                        <div className="group">
                                            <div className="py-[10px] w-[100%] bg-[#acc5b4] group-hover:bg-[#1f783b] cursor-pointer transition-background-color duration-300 ease-in-out rounded-[20px] flex justify-center items-center mt-[10px]">
                                                <p className="text-[#67706a] text-[14px] underlined group-hover:text-[#ffffff]">Download</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[60%]">
                                        <div className="pb-[10px]">
                                            <h6 className="text-[#67706a] text-[12px]">Details</h6>
                                        </div>
                                        <div className="flex flex-col gap-[20px] text-[18px]">
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">Email Address:</p>
                                                <p className="font-[700]">{email}</p>
                                            </div>
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">Participant's Name:</p>
                                                <p className="font-[700]">{firstName} {lastName}</p>
                                            </div>
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">Contact Number:</p>
                                                <p className="font-[700]">{mobile}</p>
                                            </div>
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">License Number:</p>
                                                <p className="font-[700]">{license}</p>
                                            </div>
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">Membership:</p>
                                                <p className="font-[700]">{membership}</p>
                                            </div>
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">Company:</p>
                                                <p className="font-[700]">{company}</p>
                                            </div>
                                            <div className="flex gap-[10px]">
                                                <p className="text-[#67706a]">Request Date:</p>
                                                <p className="font-[700]">{new Date(regRequest).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <>
                            <div className="flex justify-center items-center absolute top-[0px] h-[90%] w-[90%] bg-[red]">
                                <img src={props.proof} alt="" />
                            </div>
                             <div
                                onClick={props.closeModal}
                                className={`
                                    fixed inset-0 bg-black z-[1] transition-opacity duration-300 ease-in-out
                                    opacity-50 pointer-events-auto
                                `}
                                >
                            </div>
                        </>
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

export default SliderModal;