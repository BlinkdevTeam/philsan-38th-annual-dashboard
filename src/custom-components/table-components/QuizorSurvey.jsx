import {useState, useEffect} from "react"
import { useParams } from "react-router-dom"
import PhilsanLogo from "../../assets/philsan_logo.png"
import PhilsanTheme from "../../assets/philsan-38th-theme.png"
import { Link, useNavigate } from 'react-router-dom';

const TakeComponent = ({name, onSubmit}) => {
    return (
        <div className="flex flex-col gap-[10px]">
            <button onClick={onSubmit} className="cursor-pointer flex justify-between items-center w-[100%] bg-[#ffffff] shadow-sm border-l-[10px] border-[#3eac51] hover:border-[#F9B700] hover:border-l-[20px] py-[10px] text-[#1f783b] text-left px-[20px] rounded-lg transition-background-color duration-300 ease-in-out">
                {name} 
                <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13L7 7L1 1" stroke="#3eac51" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </button>
        </div>
    )
}

const DownloadComponent = ({name, onSubmit}) => {
    return (
        <div className="w-[50%]">
            <div className="flex flex-col gap-[10px]">
                <button onClick={onSubmit} className="cursor-pointer flex flex-col justify-between items-center w-[100%] bg-[#d0d0d0] hover:bg-[#bfbfbf] py-[20px] px-[10px] text-[14px] text-[#ffffff] rounded-lg transition-background-color duration-300 ease-in-out">
                    <span>Download</span>
                    <span>{name}</span>
                </button>
            </div>
        </div>
    )
}

const QuizorSurvey = () => {
    const navigate = useNavigate()
    const { email } = useParams()

    const onSubmit = ({path}) => {
        console.log("email", path+email)

        if (email) {
            navigate(path+email) 
        }
    }

    return (
        <div className="">
            <div className="w-[100%]">
                <div className="max-w-[1200] mx-auto">
                    <div className="flex">
                        <div className=" w-[100%] flex flex-col justify-center items-center h-[100vh]">
                            <div className="flex flex-col w-[70%] gap-[20px] mt-[-175px] items-center">
                                <div className="flex flex-col justify-start items-center pb-[10px]">
                                    <img className="w-[90px]" src={PhilsanLogo} alt="" />
                                    <h6 className="text-[#1f783b] text-[26px] font-[1000] mt-[-5px]">38th CONVENTION</h6>
                                </div>
                                <div className="flex flex-row gap-[20px] bg-[#fafafa] shadow-xl rounded-2xl overflow-hidden max-w-[880px]">
                                    <div className="flex flex-row items-start gap-[20px] w-[50%] py-[30px] px-[40px] bg-[#3eac51] rounded-br-[30px]">
                                        <div className="w-[20%]">
                                            <svg clipRule="evenodd" fillRule="evenodd" height="100%" width="100%" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" viewBox="0 0 2833 2833" xmlns="http://www.w3.org/2000/svg"><g id="Layer_x0020_1"><circle cx="1417" cy="1417" fill="#1f783b" r="1417"/><g fill="#fefefe"><path d="m1773 1967v-925h291v925z"/><path d="m1919 2270c-8 0-14-4-18-10l-58-105h152l-59 105c-4 6-10 10-17 10zm-99-155-44-78c-4-6-3-14 0-20 4-6 10-10 17-10h251c7 0 13 4 17 10s4 14 0 20l-44 78z"/><path d="m1793 1002c-5 0-10-2-14-5-4-4-6-9-6-15v-104c0-69 56-125 125-125h41c69 0 125 56 125 125v104c0 12-9 20-20 20z"/><path d="m2160 1199c-11 0-20-9-20-20v-177h-96c-11 0-20-8-20-20 0-11 9-20 20-20h116c11 0 20 9 20 20v197c0 11-9 20-20 20z"/><path d="m1658 2197h-954c-28 0-51-23-51-51v-1376c0-28 23-51 51-51h179v127c0 33 27 60 60 60h476c33 0 60-27 60-60v-127h179c28 0 51 23 51 51v1376c0 28-23 51-51 51zm-107-890h-147c-19 0-35-16-35-35v-147c0-19 16-34 35-34h147c19 0 34 15 34 34v147c0 19-15 35-34 35zm0 823h-147c-19 0-35-16-35-34v-148c0-19 16-34 35-34h147c19 0 34 15 34 34v148c0 18-15 34-34 34zm-142-40h136v-136h-136zm142-372h-147c-19 0-35-15-35-34v-147c0-19 16-35 35-35h147c19 0 34 16 34 35v147c0 19-15 34-34 34zm-142-40h136v-136h-136zm-135 364h-477c-11 0-20-9-20-20s9-20 20-20h477c11 0 20 9 20 20s-9 20-20 20zm231-206h-708c-11 0-20-9-20-20s9-20 20-20h708c12 0 20 9 20 20s-8 20-20 20zm-231-206h-477c-11 0-20-9-20-20s9-20 20-20h477c11 0 20 9 20 20s-9 20-20 20zm208-205h-685c-11 0-20-9-20-20s9-20 20-20h685c11 0 20 9 20 20s-9 20-20 20zm-208-206h-477c-11 0-20-9-20-20s9-20 20-20h477c11 0 20 9 20 20s-9 20-20 20zm0-206h-477c-11 0-20-9-20-20s9-20 20-20h477c11 0 20 9 20 20s-9 20-20 20zm135 254h136v-136h-136z"/><path d="m1419 866h-476c-11 0-20-9-20-20v-174c0-25 20-45 45-45h125c9-36 42-63 81-63h14c40 0 73 27 82 63h124c25 0 45 20 45 45v174c0 11-9 20-20 20z"/></g></g></svg>
                                        </div>
                                        <div className="flex flex-col gap-[5px] w-[80%]">
                                            <h6 className="text-[#ffffff] text-[22px] mt-[-5px] font-[800]">Almost there! 🎉</h6>
                                            <p className="text-[#ffffff] text-[18px] mt-[-5px] font-[200]">To download your digital certificate and souvenir, just <strong className="font-[600]">complete our survey and quizzes.</strong> Your input means a lot in making future events even better!</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[10px] w-[50%] py-[30px] px-[40px]">
                                        <TakeComponent 
                                            name="Take Survey"
                                            onSubmit={() => onSubmit({path: "/survey/"})}
                                        />
                                        <TakeComponent 
                                            name="Take Quiz"
                                            onSubmit={() => onSubmit({path: "/quiz/"})}
                                        />
                                        <div className="flex flex-row gap-[20px] justify-between">
                                            <DownloadComponent
                                                name="Certificate"
                                                onSubmit={() => onSubmit()}
                                            />
                                            <DownloadComponent
                                                name="SV Program"
                                                onSubmit={() => onSubmit()}
                                            />
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuizorSurvey;