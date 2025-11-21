import React, {useEffect, useState,} from "react";
import { getSpeaker, getParticipant } from "../../supabase/supabaseService";
import PhilsanLogo from "../../assets/philsan_logo.png"
import { Link, useNavigate, useParams } from 'react-router-dom';

const SpeakerComponent = ({data}) => {
    return (
        <div className="pb-[20px]">
            <div className="flex flex-col md:flex-row py-[10px] px-[20px] md:px-[40px] rounded-xl shadow justify-between bg-[#1F773A] items-left md:items-center">
                <div className="">
                    <h6 className="text-[18px] md:text-[24px] text-[#e9e9e9]">{data.name}</h6>
                    <p className="text-[#ffedc0] font-[300] text-[14px] md:text-[16px]">{data.topic}</p>
                </div>
                <div>
                    <a className="flex items-center group cursor-pointer text-[#e9e9e9] hover:text-[#EDB221] transition-all duration-300 ease-in-out font-[300] text-[14px] md:text-[18px] pt-[10px] md:pt-[0px]" href={data.presentation_link}><span className="text-[25px] animate-slide-x mr-[20px]">{'\u{1F449}'}</span><span>Download Presentation</span></a>
                </div>
            </div>
        </div>
    )
}

const Presentation = () => {
    const { email } = useParams()
    const [emailExist, setEmailexist] = useState(false)
    const [plenary, setPlenary] = useState([])
    const [sessionOne, setsessionOne] = useState([])
    const [sessionTwo, setsessionTwo] = useState([])
    const [sessionThree, setsessionThree] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const speakerData = await getSpeaker()
                const emailExist = await getParticipant(email).then(res => res)

                if(emailExist.length > 0){
                    setEmailexist(true)
                } else {
                    setEmailexist(false)
                }
                
                if(speakerData) {
                   const plenarySpeakers = speakerData.filter((i) => i.session_type === 0 && i)
                   const sessionOneSpeakers = speakerData.filter((i) => i.session_type === 1 && i)
                   const sessionTwoSpeakers = speakerData.filter((i) => i.session_type === 2 && i)
                   const sessionThreeSpeakers = speakerData.filter((i) => i.session_type === 3 && i)

                   if(plenarySpeakers.length > 0) {
                    setPlenary(plenarySpeakers)
                   }

                   if(sessionOneSpeakers.length > 0) {
                    setsessionOne(sessionOneSpeakers)
                   }

                   if(sessionTwoSpeakers.length > 0) {
                    setsessionTwo(sessionTwoSpeakers)
                   }

                   if(sessionThreeSpeakers.length > 0) {
                    setsessionThree(sessionThreeSpeakers)
                   }
                }
                
            } catch (err) {
                console.error("Error fetching survey:", err)
            }
        }

        fetchData()
    },[])


    console.log(plenary)

    return (
         <div className="max-w-[1280px] my-[20px] mx-auto relative">
            <div className="relative pt-[50px] px-[20px] md:px-[100px] pb-[150px] shadow-xl overflow-hidden rounded-2xl bg-[linear-gradient(to_bottom,#ffffff_0%,#ffffff_2%,#CBF9B6_100%)]">
                {emailExist ?
                    <div>
                    <div className="flex flex-col md:flex-row justify-between items-center pb-[40px]">
                        <div className="w-[200px]">
                            <img src={PhilsanLogo} alt="" />
                        </div>
                        <div className="flex flex-col items-end">
                            <h6 className="font-[Fraunces] text-[24px] md:text-[32px] text-[#1f783b] font-[700] text-center">Speaker Presentations</h6>
                        </div>
                    </div>
                    <div>
                        <div className="pb-[20px]">
                            <h2 className="text-[24px] font-bold pb-[10px] text-[#EDB221] text-center md:text-left">Plenary</h2>
                            {
                                plenary.map((i, index) => (
                                    <SpeakerComponent
                                        data={i}
                                        key={"plenary"+index}
                                    />
                                ))
                            }
                        </div>

                        <div className="pb-[20px]">
                            <h2 className="text-[24px] font-bold pb-[10px] text-[#EDB221] text-center md:text-left">Breakout Session 1</h2>
                            {
                                sessionOne.map((i, index) => {
                                    if(i.id === 7) {
                                        // this is to remove dr sarah pham's presentation
                                        return;
                                    }
                                    return (
                                        <SpeakerComponent
                                            data={i}
                                            key={"session1"+index}
                                        />
                                    )
                                })
                            }
                        </div>

                        <div className="pb-[20px]">
                            <h2 className="text-[24px] font-bold pb-[10px] text-[#EDB221] text-center md:text-left">Breakout Session 2</h2>
                            {
                                sessionTwo.map((i, index) => (
                                    <SpeakerComponent
                                        data={i}
                                        key={"session2"+index}
                                    />
                                ))
                            }
                        </div>

                        <div className="pb-[20px]">
                            <h2 className="text-[24px] font-bold pb-[10px] text-[#EDB221] text-center md:text-left">Breakout Session 3</h2>
                            {
                                sessionThree.map((i, index) => (
                                    <SpeakerComponent
                                        data={i}
                                        key={"session3"+index}
                                    />
                                ))
                            }
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-center pt-[40px]">
                        <div className="w-[200px]">
                            <img src={PhilsanLogo} alt="" />
                        </div>
                        <div className="flex flex-col items-end">
                           <h6 className="font-[Fraunces] text-[24px] md:text-[32px] text-[#1f783b] font-[700] text-center">Speaker Presentations</h6>
                        </div>
                    </div>
                </div> :
                <div>Loading...</div>
                }
            </div>
        </div>
    )

}

export default Presentation