import qrBackground from "../../assets/qr-background.png"
import { getParticipant } from "../../supabase/supabaseService";
import { useNavigate } from "react-router-dom";
import React, { useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

const QrCode = () => {
    const params = new URLSearchParams(window.location.search);
    const eValue = params.get('e');
    const navigate = useNavigate();
    console.log(eValue);


    const elementRef = useRef();

    console.log("elemref", elementRef.current)

    useEffect(() => {
        getParticipant(eValue).then((res) => {
            if(res) {
                console.log(res)
                setTimeout(() => {
                    handleDownload()
                }, 1000)
            } else {
                handleNavigation()
            }
        })
    }, [])

    const handleDownload = async () => {
        const element = elementRef.current;

        // Wait for all images inside the element to load
        const images = element.querySelectorAll("img");
        await Promise.all(
            Array.from(images).map(img => {
                if (img.complete) return Promise.resolve();
                return new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve; // handle broken links
                });
            })
        );

        // Capture with html2canvas + CORS support
        const canvas = await html2canvas(element, {
            useCORS: true,
            allowTaint: false,
            backgroundColor: null, // keep transparent if needed
        });

        // Download image
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `my-philsan-38th-annual-convention-qr-${eValue}.png`;
        link.click();
    };

    const handleNavigation = () => {
        navigate("https://philsan.org/38th-annual-convention/registration/")
    }

    return (
        <>
        {
            eValue ?

            <div className="">
                <div className="h-screen w-screen overflow-hidden absolute z-[-1]">
                    <img className="w-full h-full object-cover" src={qrBackground} alt="" />
                </div>
                <div className="flex h-[100vh] justify-center items-center">
                    <div ref={elementRef} className="relative overflow-hidden rounded-xl w-[400px]">
                        <div className="w-[100%] flex flex-col items-center text-center justify-center w-full overflow-hidden">
                            <div className="relative"> 
                                <div className="z-[1]">
                                    <div className="px-[20px] pt-[40px]">
                                        <div className="w-[150px] mx-auto">
                                            <img
                                            src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//convention-logo.png"
                                            alt="Convention Logo"
                                            className="w-full h-auto"
                                            />
                                        </div>

                                        <div className="flex flex-col justify-center items-center text-center gap-[20px] pt-[30px] py-[30px]">
                                            <div className="flex">
                                            <p className="text-[14px] text-center font-bold text-wrap">
                                                Innovating for a Sustainable Future: Harnessing Technology and Alternative Solutions in Animal Nutrition and Health
                                            </p>
                                            </div>

                                            <p className="text-[22px] font-bold text-[#1F773A] fraunces">September 30, 2025</p>

                                            <div className="flex flex-col items-center bg-gradient-to-r from-[#1F773A] to-[#EDB221] w-full py-[10px] rounded-tl-[40px] rounded-br-[40px]">
                                            <p className="text-[16px] text-[#ffffff] fraunces">Okada Manila Paranaque City,</p>
                                            <p className="text-[16px] text-[#ffffff] fraunces">Philippines</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-[100%] flex justify-center">
                                        <div className="bg-[#ffffff] p-[20px] rounded-xl">
                                            <img className="w-[200px]" src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${eValue}`} alt="" />
                                        </div>
                                    </div>
                                    <div className="w-[100%] z-[1] pt-[20px]">
                                        <img src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//Sponsors%20Logo@3x-8%201.png" alt="" />
                                    </div>
                                </div>
                                <img
                                    src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//Philsan%20Ticket%20BG@3x-8%201.png"
                                    alt="Decorative Background"
                                    className="absolute w-full max-w-none h-auto opacity-[.5] bottom-0 z-[-1] px-[5px]"
                                />
                            </div>
                        </div>
                        <img className="absolute shadow-lg top-[0px] w-full left-0 z-[-1]" src="https://shvutlcgljqiidqxqrru.supabase.co/storage/v1/object/public/philsan-email-assets//ticket_bg.png" alt="" />
                    </div>
                </div>
            </div> :
            {
                handleNavigation
            }
        }
        </>
    )
}

export default QrCode