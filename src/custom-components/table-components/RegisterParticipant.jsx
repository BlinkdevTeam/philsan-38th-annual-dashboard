import React, {useState, useRef,} from "react";
import { textFields, membersRadio, souvenirRadio, sponsorRadio, certRadio } from "./Config/regParticipantsData";
import { generateToken } from "./Config/generateToken";
import PhilsanLogo from "../../assets/philsan_logo.png";
import { createItem, storageUpload, getParticipant } from "../../supabase/supabaseService";
import UploadCsv from "./UploadCsv";

const RegisterParticipant = ({loggedSponsor, setgoToRegistration}) => {
    const [isEmailExisting, setisEmailExisting] = useState(false)
    const [registerSuccess, setRegisterSuccess] = useState(false)
    const fileInputRef = useRef(null);
    const [proof, setProof] = useState(null)
    const [regDetails, setRegDetails] = useState({
            email: null,
            first_name: null,
            last_name: null,
            middle_name: null,
            mobile: null,
            company: null,
            position: null,
            agri_license: null,
            membership: null,
            souvenir: null,
            certificate_needed: null,
            sponsored: "N/A",
            sponsor: null,
            // payment: sponsor.name === "Philsan Secretariat" ?  null : "sponsored",
            payment: "N/A",
            reg_request: new Date().toISOString(),
            reg_status: "pending",
            token: generateToken(16)
        });
    
    const handleChange = (e) => {
        if(e.target.name === "payment" && e.target.files.length > 0 ) {
            setProof(e.target.files[0])
            setRegDetails(prev => ({
                ...prev,
                payment: e.target.files[0].name.replace(/\s+/g, "_") //store actual filename in the regDetails state
            }));
        } else {
            setRegDetails(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }));
        }
    }  

    const handleUploadClick = () => {
        fileInputRef.current.click(); // Trigger hidden input
    };

    const submitRegistration = () => {
        const emailExist = getParticipant(regDetails.email).then(res => res)
        
        if(emailExist.length > 0) {
            setisEmailExisting(true)
        } else {
            createItem({
                email: regDetails.email,
                first_name: regDetails.first_name,
                last_name: regDetails.last_name,
                middle_name: regDetails.middle_name,
                mobile: regDetails.mobile,
                company: regDetails.company,
                position: regDetails.position,
                agri_license: regDetails.agri_license,
                membership: regDetails.membership,
                souvenir: regDetails.souvenir,
                certificate_needed: regDetails.certificate_needed,
                sponsored: "N/A",
                sponsor: loggedSponsor !== "Philsan Secretariat" ? loggedSponsor : "Non-Sponsored",
                // payment: regDetails.sponsor === "Non-Sponsored" ? filePath : null,
                payment: null,
                reg_request: new Date().toISOString(),
                reg_status: "pending",
                token: generateToken(16),
                registered_by: loggedSponsor.name !== "Philsan Secretariat" ? "sponsor" : "philsan secretariat"
            }).then(r => {
                alert("Regsitration Successful")
                setgoToRegistration()
                setisEmailExisting(false)
            })
        }
        
        // let filePath;
        
        // if(regDetails.payment !== "sponsored") {
        //     const uniqueFileName = `${Date.now()}_${regDetails.payment}`;
        //     filePath = `proofs/${uniqueFileName}`;
        // }


        // storageUpload(filePath, proof)
        // .then((res) => {
        //     if(res) {
        //         createItem({
        //             email: regDetails.email,
        //             first_name: regDetails.first_name,
        //             last_name: regDetails.last_name,
        //             middle_name: regDetails.middle_name,
        //             mobile: regDetails.mobile,
        //             company: regDetails.company,
        //             position: regDetails.position,
        //             agri_license: regDetails.agri_license,
        //             membership: regDetails.membership,
        //             souvenir: regDetails.souvenir,
        //             certificate_needed: regDetails.certificate_needed,
        //             sponsored: "N/A",
        //             sponsor: sponsor.name !== "Philsan Secretariat" ? sponsor.name : regDetails.sponsor,
        //             // payment: regDetails.sponsor === "Non-Sponsored" ? filePath : null,
        //             payment: "N/A",
        //             reg_request: new Date().toISOString(),
        //             reg_status: "pending",
        //             token: generateToken(16),
        //             registered_by: sponsor.name !== "Philsan Secretariat" ? "sponsor" : "philsan secretariat"
        //         }).then(r => {
        //             if(r) {
        //                 console.log(r)
        //             }
        //         })
        //     }
        // })
    }

    const triggerSubmit = (e) => {
        e.preventDefault()
        //VERIFICATION
        let err = 0;
        
        Object.keys(regDetails).forEach(item => {

            if(item === "sponsor") {
                if(regDetails["sponsor"] === "Non-Sponsored") {
                    if(regDetails["payment"] === null) {
                        err++;
                        setRegDetails((prev) => (
                            {
                                ...prev,
                                payment: false
                            }
                        ))
                    }
                } else {
                    if(regDetails["payment"] === false || regDetails["payment"] === null) {
                        err++;
                        setRegDetails((prev) => (
                            {
                                ...prev,
                                payment: "sponsored"
                            }
                        ))
                    }
                }
            }
            
            if(item !== "sponsor") {
                if (regDetails[item] === null) {
                    err++;
                    setRegDetails((prev) => (
                        {
                            ...prev,
                            [item]: false
                        }
                    ))
                } else if(regDetails[item] === false) {
                    err++;
                }
            }
        });

        if (err > 0) {
           return console.log("Fiil all required inputs")
        }  submitRegistration()
    };

    return (
        <div className="w-[100%]">
            <div className="max-w-[1200]">
                <div className="flex">
                    <div className="w-[100%] flex justify-center items-start h-[100vh]">
                        <div className="bg-[#ffffff] px-[30px] pb-[60px] pt-[40px] rounded-lg shadow-md">
                            <div className="flex justify-between">
                                <div className="flex gap-[10px] items-center cursor-pointer pb-[40px]" onClick={() => setgoToRegistration()}>
                                    <svg width="14" height="12" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M14.9998 7H1.99985M6.99985 1L1.70696 6.29289C1.31643 6.68342 1.31643 7.31658 1.70696 7.70711L6.99985 13" stroke="#111111" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                    <h6 className="text-[#67706a] text-[16px]">Register New Participant</h6>
                                </div>
                            </div>
                            <div className="flex gap-[50px]">
                                <div className="">
                                    <div className="flex flex-col gap-[10px]">
                                        {
                                            textFields.map((i, index) => {
                                                return (
                                                    <div key={i.name+index} className="flex flex-col gap-[5px] w-[350px]">
                                                        <p className={`font-[600] text-[12px] ${regDetails[i.name] === false ? "text-[red]" : "text-[#1f783b]"} mb-[-6px]`}>{i.placeholder}</p>
                                                        <input value={regDetails.name} name={i.name} onChange={(e) => handleChange(e)} className="bg-[#eaeeeb] p-[10px] rounded-md" type="text" placeholder={"Enter " + i.placeholder} required/>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                <div>
                                    <div className="w-[100%] flex flex-col gap-[15px]">
                                        {/* PHILSAN Member --> */}
                                        <div className="flex flex-col">
                                            <p className="font-[700] text-[#1f783b]">Are you a PHILSAN Member?</p>
                                            {
                                                regDetails["membership"] === false &&
                                                <p className="text-[red]">This field is required</p>
                                            }
                                            <div className="flex gap-[20px]">
                                                {membersRadio.map((i, index) => {
                                                    return (
                                                        <div key={"member"+index} className="flex gap-[5px]">
                                                            <input type="radio" name="membership" value={i} onChange={(e) => handleChange(e)}/>
                                                            <p>{i}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Souvenir Program --> */}
                                        <div className="flex flex-col">
                                            <p className="font-[700] text-[#1f783b]">Souvenir Program</p>
                                            {
                                                regDetails["souvenir"] === false &&
                                                <p className="text-[red]">This field is required</p>
                                            }
                                            <div className="flex gap-[20px]">
                                                {souvenirRadio.map((i, index) => {
                                                    return (
                                                        <div key={"souvenir"+index} className="flex gap-[5px]">
                                                            <input type="radio" name="souvenir" value={i} onChange={(e) => handleChange(e)}/>
                                                            <p>{i}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                        {/* Certificate of Attendance --> */}
                                        <div className="flex flex-col">
                                            <p className="font-[700] text-[#1f783b]">Do you need a Certificate of Attendance?</p>
                                            {
                                                regDetails["certificate_needed"] === false &&
                                                <p className="text-[red]">This field is required</p>
                                            }
                                            <div className="flex gap-[20px]">
                                                {certRadio.map((i, index) => {
                                                    return (
                                                        <div key={"cert"+index} className="flex gap-[5px]">
                                                            <input type="radio" name="certificate_needed" value={i} onChange={(e) => handleChange(e)}/>
                                                            <p>{i}</p>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>

                                       {/* Sponsors --> */
                                        loggedSponsor === "Philsan Secretariat" && 
                                            <div className="flex flex-col">
                                                <p className="font-[700] text-[#1f783b]">Who's your sponsor?</p>
                                                {
                                                    regDetails["sponsor"] === false &&
                                                    <p className="text-[red]">This field is required</p>
                                                }
                                                <div className="flex gap-[50px]">
                                                    {
                                                        sponsorRadio.map((sponsorGroup, index) => {
                                                        return (
                                                            <div key={"sponsorGroup"+index} className="flex flex-col gap-[10px]">
                                                                {sponsorGroup.map((i, index) => {
                                                                    return (
                                                                        <div key={"sponsor"+index} className="flex gap-[5px]">
                                                                            <input type="radio" name="sponsor" value={i} onChange={(e) => handleChange(e)}/>
                                                                            <p>{i}</p>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="flex pt-[20px]">
                                <button 
                                    onClick={triggerSubmit} 
                                    className="cursor-pointer bg-[#F9B700] hover:bg-[#ffe700] py-[20px] px-[100px] text-[#ffffff] rounded-lg transition-background-color duration-300 ease-in-out"
                                >
                                    <span>Register</span>
                                </button>
                            </div>
                            {isEmailExisting && <p className="text-red">Email Already exist</p> }
                            {registerSuccess && <p className="text-red">Registration Sent</p> }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RegisterParticipant;