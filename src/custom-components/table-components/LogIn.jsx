import React, {useState} from "react"
import PhilsanLogo from "../../assets/philsan_logo.png"
import PhilsanIcon from "../../assets/PhilsanIcon.png"
import Sponsors from "../../Config/Sponsors";
import { Link, useNavigate } from 'react-router-dom';

const Login = ({setSponsorIn}) => {
    const [code, setCode] = useState(null)

    const navigate = useNavigate() // 👈 Initialize

    const onSubmit = () => {
        const filteredSponsor = Sponsors.find((i) => i.password === code) // use find instead of filter

        if (filteredSponsor) {
            // setSponsorIn(filteredSponsor.sponsor)\
            console.log(filteredSponsor.password)
            navigate(`/${filteredSponsor.password}`) // 👈 Navigate to the desired route
        } else {
            alert("Invalid code")
        }
    }
    
    return (
        <div className="w-[100%]">
            <div className="max-w-[1200]">
                <div className="flex">
                    <div className=" w-[100%] flex justify-center items-center h-[100vh]">
                        <div className="flex flex-col gap-[20px] mt-[-100px]">
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
                                        <h6 className="font-[700] text-[#1f783b]">Enter Login Code</h6>
                                        <input onChange={(e) => setCode(e.target.value)} className="bg-[#eaeeeb] p-[10px] rounded-md" type="text" placeholder="Login Code" />
                                    </div>
                                    <button onClick={onSubmit} className="w-[100%] bg-[#F9B700] hover:bg-[#ffe700] py-[10px] text-[#ffffff] rounded-lg transition-background-color duration-300 ease-in-out">Login</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login